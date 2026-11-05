"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import PrivateGuard from "@/components/PrivateGuard";
import ConfirmModal from "@/components/studios/ConfirmModal";
import EmptyState from "@/components/studios/EmptyState";
import { api } from "@/lib/api";

const InvoiceButton = dynamic(() => import("@/components/InvoicePDF").then((m) => m.InvoiceButton), {
  ssr: false,
  loading: () => <span className="loading loading-spinner loading-xs" />,
});

const BADGE: Record<string, string> = {
  Pending: "badge-warning", Confirmed: "badge-success", Completed: "badge-info", Cancelled: "badge-error",
};
const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

function Bookings() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [target, setTarget] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/bookings/mine").then(setItems).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const cancel = async () => {
    setBusy(true);
    try {
      await api(`/bookings/${target._id}/cancel`, { method: "PATCH" });
      setItems((p) => p.map((b) => (b._id === target._id ? { ...b, status: "Cancelled" } : b)));
      toast.success("Booking cancelled");
      setTarget(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return <div className="max-w-5xl mx-auto p-8 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 w-full" />)}</div>;

  const shown = tab === "All" ? items : items.filter((b) => b.status === tab);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title">My Bookings</h1>
      <p className="section-sub">Track every session you've requested.</p>

      {items.length === 0 ? (
        <div className="mt-8"><EmptyState title="No bookings yet" text="Find a space and lock in your session." cta="Explore Studios" href="/studios" /></div>
      ) : (
        <>
          <div role="tablist" className="tabs tabs-box mt-6 w-fit max-w-full overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} role="tab" onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>
                {t}{t !== "All" && <span className="ml-1 opacity-60">({items.filter((b) => b.status === t).length})</span>}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-10 text-center text-base-content/70">No {tab.toLowerCase()} bookings.</p>
          ) : (
            <div className="grid gap-4 mt-6">
              {shown.map((b) => (
                <div key={b._id} className="card bg-base-200 p-4 flex-col sm:flex-row sm:items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.studioImage} alt={b.studioTitle} className="w-full sm:w-44 h-32 object-cover rounded-box" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/studios/${b.studioId}`} className="font-bold text-lg hover:text-primary line-clamp-1">{b.studioTitle}</Link>
                    <p className="text-sm text-base-content/70 mt-1">
                      {b.date} · {b.startTime}–{b.endTime} · {Number(b.hours).toFixed(1)} hrs
                    </p>
                    <p className="font-semibold text-primary mt-1">Total ${Number(b.totalPrice).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className={`badge ${BADGE[b.status]}`}>{b.status}</span>
                    {b.status === "Pending" && (
                      <button className="btn btn-sm btn-error btn-outline" onClick={() => setTarget(b)}>Cancel Booking</button>
                    )}
                    {b.status === "Pending" || b.status === "Confirmed" ? <InvoiceButton b={b} /> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal open={!!target} title="Cancel this booking?" text="The host will be notified and the time slot will be released."
        confirmText="Yes, cancel it" onConfirm={cancel} onClose={() => setTarget(null)} busy={busy} />
    </div>
  );
}

export default function Page() {
  return <PrivateGuard><Bookings /></PrivateGuard>;
}