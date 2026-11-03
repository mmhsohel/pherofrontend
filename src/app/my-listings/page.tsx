"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
      toast.success("Studio deleted");
      setTarget(null);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-8 space-y-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-16 w-full" />)}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="section-title">My Studio Listings</h1>
      {items.length === 0 ? <div className="mt-8"><EmptyState title="You haven't listed a studio yet" text="Share your space with creators nearby." cta="Add New Studio" href="/add-studio" /></div> : (
        <div className="overflow-x-auto mt-8">
          <table className="table bg-base-200">
            <thead><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>{items.map((s) => (
              <tr key={s._id}>
                <td className="font-semibold">{s.title}</td><td>{s.category}</td><td>${s.hourlyRate}/hr</td><td>{s.location}</td>
                <td className="flex gap-2">
                  <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline btn-primary">Update</Link>
                  <button onClick={() => setTarget(s)} className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal open={!!target} title="Delete this studio?" text={`"${target?.title}" will be permanently removed.`}
        confirmText="Yes, delete" onConfirm={remove} onClose={() => setTarget(null)} busy={busy} />
    </div>
  );
}
export default function Page() { return <PrivateGuard><Listings /></PrivateGuard>; }