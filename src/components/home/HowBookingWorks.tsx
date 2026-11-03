// HowBookingWorks.tsx
import { Search, Clock, CalendarCheck, Clapperboard } from "lucide-react";
const steps = [
  { icon: Search, t: "Discover Spaces", d: "Filter by category, price and location." },
  { icon: Clock, t: "Select Shoot Hours", d: "Check live availability and choose your slot." },
  { icon: CalendarCheck, t: "Book Instantly", d: "Send your request with transparent pricing." },
  { icon: Clapperboard, t: "Create & Produce", d: "Arrive, set up, and make something great." },
];
export default function HowBookingWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="section-title">How Booking Works</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {steps.map(({ icon: I, t, d }, i) => (
          <div key={t} className="card bg-base-200 p-6 h-full">
            <span className="text-primary text-sm font-bold">Step {i + 1}</span>
            <I className="text-primary my-3" size={32} />
            <h3 className="font-bold text-lg">{t}</h3><p className="text-sm text-base-content/70 mt-1">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}