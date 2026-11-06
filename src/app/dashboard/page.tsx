"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, BellRing, CalendarCheck, Wallet, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import PrivateGuard from "@/components/PrivateGuard";
import EmptyState from "@/components/studios/EmptyState";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

const BADGE: Record<string, string> = {
  Pending: "badge-warning", Confirmed: "badge-success", Completed: "badge-info", Cancelled: "badge-error",
};
const money = (n: number) => `$${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

function Stat({ icon: I, label, value, hint }: { icon: React.ElementType; label: string; value: string | number; hint: string }) {
  return (
    <div className="card bg-base-200 border border-base-300 p-5 h-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/70">{label}</p>
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary"><I size={20} /></span>
      </div>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
      <p className="text-xs text-base-content/60 mt-1">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const { data } = useSession();
  const [studios, setStudios] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [host, setHost] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    Promise.all([api("/studios/mine/list"), api("/bookings/mine"), api("/bookings/host")])
      .then(([s, m, h]) => { setStudios(s); setMine(m); setHost(h); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const confirm = async (b: any) => {
    setBusyId(b._id);
    try {
      await api(`/bookings/${b._id}/confirm`, { method: "PATCH" });
      setHost((p) => p.map((x) => (x._id === b._id ? { ...x, status: "Confirmed" } : x)));
      toast.success("Booking confirmed");
    } catch (e: any) {
      toast.error(e.message); 
    } finally {
      setBusyId("");
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="skeleton h-10 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-32" />)}</div>
        <div className="skeleton h-64 w-full" />
      </div>
    );

  const now = Date.now();
  const pending = host.filter((b) => b.status === "Pending");
  const upcoming = mine
    .filter((b) => b.status === "Confirmed" && new Date(b.startAt).getTime() >= now)
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
  const revenue = host
    .filter((b) => b.status === "Confirmed" || b.status === "Completed")
    .reduce((sum, b) => sum + (b.hourlyRate ? Number(b.hours) * b.hourlyRate : Number(b.totalPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Welcome back, {data?.user.name?.split(" ")[0]}</h1>
          <p className="section-sub">Here is what needs your attention today.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary"><Plus size={18} /> Add New Studio</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        <Stat icon={Building2} label="Active listings" value={studios.length} hint="Studios you host" />
        <Stat icon={BellRing} label="Pending requests" value={pending.length} hint="Waiting for your confirmation" />
        <Stat icon={CalendarCheck} label="Upcoming sessions" value={upcoming.length} hint="Your confirmed bookings" />
        <Stat icon={Wallet} label="Confirmed revenue" value={money(revenue)} hint="From confirmed and completed bookings" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mt-10">
        {/* Host requests */}
        <section>
          <h2 className="text-xl font-bold mb-4">Booking requests on your studios</h2>
          {host.length === 0 ? (
            <EmptyState title="No requests yet" text="Requests appear here when creators book your studios." cta="View My Listings" href="/my-listings" />
          ) : (
            <div className="space-y-3">
              {host.slice(0, 6).map((b) => (
                <div key={b._id} className="card bg-base-200 p-4 flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{b.studioTitle}</p>
                    <p className="text-sm text-base-content/70">{b.userName} · {b.date} · {b.startTime}–{b.endTime}</p>
                    <p className="text-sm font-semibold text-primary">{money(b.totalPrice)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${BADGE[b.status]}`}>{b.status}</span>
                    {b.status === "Pending" && (
                      <button className="btn btn-sm btn-primary" disabled={busyId === b._id} onClick={() => confirm(b)}>
                        {busyId === b._id ? <span className="loading loading-spinner loading-xs" /> : <><Check size={14} /> Confirm</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

    
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your upcoming sessions</h2>
            <Link href="/my-bookings" className="link link-primary text-sm">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled" text="Book a space for your next shoot." cta="Explore Studios" href="/studios" />
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((b) => (
                <Link key={b._id} href={`/studios/${b.studioId}`} className="card card-side bg-base-200 p-3 items-center gap-4 hover:shadow-md transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.studioImage} alt={b.studioTitle} className="w-24 h-20 object-cover rounded-lg" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{b.studioTitle}</p>
                    <p className="text-sm text-base-content/70">{b.date} · {b.startTime}–{b.endTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your recent listings</h2>
          <Link href="/my-listings" className="link link-primary text-sm">Manage all</Link>
        </div>
        {studios.length === 0 ? (
          <EmptyState title="You haven't listed a studio yet" text="Share your space with creators nearby." cta="Add New Studio" href="/add-studio" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studios.slice(0, 4).map((s) => (
              <Link key={s._id} href={`/studios/${s._id}`} className="card bg-base-200 overflow-hidden h-full hover:shadow-md transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <p className="font-semibold line-clamp-1">{s.title}</p>
                  <p className="text-sm text-base-content/70">${s.hourlyRate}/hr · {s.rating ? s.rating.toFixed(1) : "New"} ★</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Page() {
  return <PrivateGuard><Dashboard /></PrivateGuard>;
}