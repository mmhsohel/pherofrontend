"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const toHours = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
};

const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function BookingModal({
  studio,
  open,
  onClose,
}: {
  studio: any;
  open: boolean;
  onClose: () => void;
}) {
  const { data } = useSession();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [busySlots, setBusySlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const rate = Number(studio.hourlyRate) || 0;
  const deposit = Number(studio.deposit) || 0;

  useEffect(() => {
    if (!open || !date) return setBusySlots([]);
    api(`/bookings/availability/${studio._id}?date=${date}`)
      .then(setBusySlots)
      .catch(() => setBusySlots([]));
  }, [open, date, studio._id]);

  const hours = startTime && endTime ? Math.max(0, toHours(endTime) - toHours(startTime)) : 0;
  const rental = hours * rate;
  const total = rental + deposit;
  const invalidRange = Boolean(startTime && endTime) && hours <= 0;

  const reset = () => {
    setDate("");
    setStart("");
    setEnd("");
    setBusySlots([]);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!data?.user) {
      toast.info("Please log in to book");
      return router.push("/login");
    }
    setLoading(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({ studioId: studio._id, date, startTime, endTime }),
      });
      toast.success("Booking request sent! The host will confirm shortly.");
      reset();
      onClose();
      router.push("/my-bookings");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-xl">Book {studio.title}</h3>
        <p className="text-sm text-base-content/70">
          ${rate}/hr · up to {studio.capacity} people
        </p>

        <div className="grid gap-3 mt-4">
          <label className="text-sm font-semibold">
            Date
            <input
              type="date"
              min={todayLocal()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full mt-1"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">
              Start
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStart(e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </label>
            <label className="text-sm font-semibold">
              End
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEnd(e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </label>
          </div>

          {invalidRange && (
            <p className="text-error text-sm">End time must be after the start time.</p>
          )}

          {busySlots.length > 0 && (
            <div className="rounded-box bg-warning/15 border border-warning/40 p-3 text-sm">
              <p className="font-semibold">Already booked on this day:</p>
              <p>{busySlots.map((b) => `${b.startTime}–${b.endTime}`).join(", ")}</p>
            </div>
          )}

          <div className="bg-base-200 rounded-box p-3 text-sm space-y-1">
            <p>
              Rate: ${rate}/hr × {hours.toFixed(1)} hrs = ${rental.toFixed(2)}
            </p>
            <p>Security deposit: ${deposit.toFixed(2)}</p>
            <p className="font-bold text-base">Total: ${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={close}>
            Close
          </button>
          <button
            className="btn btn-primary"
            disabled={!date || !startTime || !endTime || hours <= 0 || loading}
            onClick={submit}
          >
            {loading ? <span className="loading loading-spinner" /> : "Confirm Booking"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={close} />
    </dialog>
  );
}