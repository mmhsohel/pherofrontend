"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PrivateGuard from "@/components/PrivateGuard";
import ConfirmModal from "@/components/studios/ConfirmModal";
import EmptyState from "@/components/studios/EmptyState";
import { api } from "@/lib/api";

const badge: Record<string, string> = {
  Pending: "badge-warning", Confirmed: "badge-success", Completed: "badge-info", Cancelled: "badge-error",
};

function Bookings() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<any>(null);

  useEffect(() => { api("/bookings/mine").then(setItems).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);

  const cancel = async () => {
    try {
      await api(`/bookings/${target._id}/cancel`, { method: "PATCH" });
      setItems((p) => p.map((b) => (b._id === target._id ? { ...b, status: "Cancelled" } : b)));
      toast.success("Booking cancelled");
    } catch (e: any) { toast.error(e.message); }
    setTarget(null);
  };

  if (loading) return <div className="max-w-5xl mx-auto p-8 space-y-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-24" />)}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title">My Bookings</h1>
      {items.length === 0 ? <div className="mt-8"><EmptyState title="No bookings yet" text="Find a space and lock in your session." cta="Explore Studios" href="/studios" /></div> : (
        <div className="grid gap-4 mt-8">
          {items.map((b) => (
            <div key={b._id} className="card card-side bg-base-200 p-4 items-center gap-4 flex-col sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.studioImage} alt={b.studioTitle} className="w-full sm:w-40 h-28 object-cover rounded-box" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{b.studioTitle}</h3>
                <p className="text-sm text-base-content/70">{b.date} · {b.startTime}–{b.endTime} · {b.hours} hrs</p>
                <p className="font-semibold text-primary">${b.totalPrice}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`badge ${badge[b.status]}`}>{b.status}</span>
                {b.status === "Pending" && <button className="btn btn-sm btn-error btn-outline" onClick={() => setTarget(b)}>Cancel Booking</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!target} title="Cancel this booking?" text="The host will be notified and the slot released."
        confirmText="Cancel booking" onConfirm={cancel} onClose={() => setTarget(null)} />
    </div>
  );
}
export default function Page() { return <PrivateGuard><Bookings /></PrivateGuard>; }