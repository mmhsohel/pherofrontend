import { ShieldCheck, BadgeCheck, Wrench, Headset } from "lucide-react";
const items = [
  { icon: ShieldCheck, t: "Liability Protection", d: "Every booking is covered against accidental damage." },
  { icon: BadgeCheck, t: "Verified Profiles", d: "Hosts and creators are identity-checked." },
  { icon: Wrench, t: "Equipment Safety", d: "Gear is inspected and logged before each session." },
  { icon: Headset, t: "24/7 Host Support", d: "A real person is always one message away." },
];
export default function HostGuarantee() {
  return (
    <section className="bg-base-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Host Guarantee & Creator Support</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {items.map(({ icon: I, t, d }) => (
            <div key={t} className="card bg-base-100 p-6 h-full shadow">
              <I className="text-primary" size={34} /><h3 className="font-bold text-lg mt-3">{t}</h3>
              <p className="text-sm text-base-content/70 mt-1">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}