import Link from "next/link";
import { Target, Eye, Handshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import Image from "next/image";

const stats = [
  { v: "5", l: "Studio categories" },
  { v: "100%", l: "Transparent pricing" },
  { v: "24/7", l: "Host support" },
  { v: "0", l: "Double bookings" },
];

const values = [
  { icon: Handshake, t: "Creators First", d: "Every feature starts with one question: does it get a creator into the right room faster?" },
  { icon: ShieldCheck, t: "Trust by Default", d: "Verified profiles, clear pricing and fair cancellation rules protect hosts and guests alike." },
  { icon: Sparkles, t: "Craft Over Clutter", d: "Clean listings, honest photos and real specs, with no hidden fees and no guesswork." },
  { icon: Users, t: "Community Driven", d: "Hosts and creators grow together, and every review makes the next booking better." },
];


const team = [
  { name: "Sohel", role: "Founder & Full-Stack Developer", img: "/images/team/per.jpeg" },
  { name: "Sumon", role: "Product & UX Design", img: "/images/team/per2.jpeg" },
  { name: "Jibon", role: "Host Community Lead", img: "/images/team/per3.jpeg" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="section-title">Built for the People Who Make Things</h1>
            <p className="section-sub">
              StudioSpace is a peer-to-peer marketplace connecting studio owners with photographers, filmmakers,
              podcasters, musicians and artists. Great work needs the right room, and we make finding it simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
              <Link href="/add-studio" className="btn btn-outline btn-primary">Host Your Space</Link>
            </div>
          </div>
          <Image
            src="/images/hero/1.jpeg"
            alt="Photography studio with lighting equipment"
            className="w-full h-72 md:h-96 object-cover rounded-box shadow-lg"
            width={600}
            height={400}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="card bg-base-200 p-6 text-center h-full justify-center">
              <p className="text-4xl font-extrabold text-primary">{s.v}</p>
              <p className="text-sm text-base-content/70 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 grid gap-6 md:grid-cols-2">
        <div className="card bg-base-200 p-8 h-full">
          <Target className="text-primary" size={36} />
          <h2 className="text-2xl font-bold mt-4">Our Mission</h2>
          <p className="text-base-content/70 mt-2">
            To put every creator in the right room, from cyc walls to soundproof suites, with fair and transparent pricing.
          </p>
        </div>
        <div className="card bg-base-200 p-8 h-full">
          <Eye className="text-primary" size={36} />
          <h2 className="text-2xl font-bold mt-4">Our Vision</h2>
          <p className="text-base-content/70 mt-2">
            A world where no studio sits empty and no creator is turned away for lack of space, with an open network of
            spaces powering independent production.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="section-title">Our Story</h2>
        <div className="mt-4 space-y-4 text-base-content/80 leading-relaxed">
          <p>
            StudioSpace started with a familiar problem. Independent creators spent more time hunting for a place to shoot
            than shooting, while great studios sat idle between big-budget bookings.
          </p>
          <p>
            We built a single place where hosts list their spaces, creators see real availability, and both sides know
            exactly what a session costs before it starts. Confirmed slots can't overlap, prices are always visible, and
            every listing is tied to a real host.
          </p>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">What We Stand For</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {values.map(({ icon: I, t, d }) => (
              <div key={t} className="card bg-base-100 p-6 h-full shadow">
                <I className="text-primary" size={32} />
                <h3 className="font-bold text-lg mt-3">{t}</h3>
                <p className="text-sm text-base-content/70 mt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="section-title">Meet the Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {team.map((m) => (
            <div key={m.name + m.role} className="card bg-base-200 shadow h-full overflow-hidden">
              
              <Image src={m.img} alt={m.name} className="h-64 w-full object-cover" width={600} height={400} />
              <div className="card-body p-5">
                <h3 className="font-bold text-lg">{m.name}</h3>
                <p className="text-sm text-base-content/70">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-content py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold">Ready to find your next space?</h2>
          <p className="mt-2 opacity-90">Browse studios today, or list your own and start welcoming creators.</p>
          <Link href="/studios" className="btn bg-base-100 text-base-content border-0 mt-6">Explore Studios</Link>
        </div>
      </section>
    </>
  );
}