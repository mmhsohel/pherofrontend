"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import PrivateGuard from "@/components/PrivateGuard";
import ConfirmModal from "@/components/studios/ConfirmModal";
import EmptyState from "@/components/studios/EmptyState";
import { api } from "@/lib/api";

function Listings() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/studios/mine/list").then(setItems).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      setItems((p) => p.filter((s) => s._id !== target._id));
      toast.success(`"${target.title}" was deleted`);
      setTarget(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto p-8 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full" />)}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">My Studio Listings</h1>
          <p className="section-sub">{items.length} {items.length === 1 ? "space" : "spaces"} listed</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary"><Plus size={18} /> Add New Studio</Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8"><EmptyState title="You haven't listed a studio yet" text="Share your space with creators nearby." cta="Add New Studio" href="/add-studio" /></div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto mt-8 rounded-box border border-base-300">
            <table className="table bg-base-200">
              <thead>
                <tr><th>Studio</th><th>Category</th><th>Rate</th><th>Location</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt={s.title} className="w-16 h-12 object-cover rounded-lg" />
                        <span className="font-semibold">{s.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary badge-outline">{s.category}</span></td>
                    <td>${s.hourlyRate}/hr</td>
                    <td>{s.location}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link href={`/studios/${s._id}`} className="btn btn-sm btn-ghost" aria-label="View"><Eye size={16} /></Link>
                        <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline btn-primary"><Pencil size={14} /> Update</Link>
                        <button onClick={() => setTarget(s)} className="btn btn-sm btn-error"><Trash2 size={14} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="grid gap-4 mt-8 md:hidden">
            {items.map((s) => (
              <div key={s._id} className="card bg-base-200 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="h-40 w-full object-cover rounded-t-box" />
                <div className="card-body p-4">
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-base-content/70">{s.category} · {s.location} · ${s.hourlyRate}/hr</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Link href={`/studios/${s._id}`} className="btn btn-sm btn-ghost border-base-300">View</Link>
                    <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline btn-primary">Update</Link>
                    <button onClick={() => setTarget(s)} className="btn btn-sm btn-error">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal open={!!target} title="Delete this studio?" text={`"${target?.title}" will be permanently removed and can't be recovered.`}
        confirmText="Yes, delete" onConfirm={remove} onClose={() => setTarget(null)} busy={busy} />
    </div>
  );
}

export default function Page() {
  return <PrivateGuard><Listings /></PrivateGuard>;
}