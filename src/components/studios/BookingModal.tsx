"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function BookingModal({ studio, open, onClose }: { studio: any; open: boolean; onClose: () => void }) {
  const { data } = useSession();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [busy, setBusy] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) api(`/bookings/availability/${studio._id}?date=${date}`).then(setBusy).catch(() => {});
  }, [date, studio._id]);

  const hours = startTime && endTime ? Math.max(0, (+endTime.split(":")[0] + +endTime.split(":")[1] / 60) - (+startTime.split(":")[0] + +startTime.split(":")[1] / 60)) : 0;
  const total = hours * studio.hourlyRate + studio.deposit;

  const submit = async () => {
    if (!data?.user) { toast.info("Please log in to book"); return router.push("/login"); }
    setLoading(true);
    try {
      await api("/bookings", { method: "POST", body: JSON.stringify({ studioId: studio._id, date, startTime, endTime }) });
      toast.success("Booking request sent!");
      onClose(); router.push("/my-bookings");
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-xl">Book {studio.title}</h3>
        <div className="grid gap-3 mt-4">
          <input type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered" />
          <div className="grid grid-cols-2 gap-3">
            <input type="time" value={startTime} onChange={(e) => setStart(e.target.value)} className="input input-bordered" />
            <input type="time" value={endTime} onChange={(e) => setEnd(e.target.value)} className="input input-bordered" />
          </div>
          {busy.length > 0 && (
            <div className="alert alert-warning text-sm">Already booked: {busy.map((b) => `${b.startTime}–${b.endTime}`).join(", ")}</div>
          )}
          <div className="bg-base-200 rounded-box p-3 text-sm space-y-1">
            <p>Rate: ${studio.hourlyRate}/hr × {hours.toFixed(1)} hrs</p>
            <p>Security deposit: ${studio.deposit}</p>
            <p className="font-bold text-base">Total: ${total.toFixed(2)}</p>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={!date || !startTime || !endTime || hours <= 0 || loading} onClick={submit}>
            {loading ? <span className="loading loading-spinner" /> : "Confirm Booking"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}