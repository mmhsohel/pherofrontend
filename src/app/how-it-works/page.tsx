import Link from "next/link";
import {
  Search, Clock, CalendarCheck, Clapperboard,
  ImagePlus, BellRing, BadgeCheck, Wallet,
} from "lucide-react";

const creatorSteps = [
  { icon: Search, t: "Discover Spaces", d: "Filter by category, price and city. Every listing shows photos, amenities, capacity and verified reviews." },
  { icon: Clock, t: "Select Shoot Hours", d: "Pick a date and time range. Booked slots are shown up front, so you never plan around a taken room." },
  { icon: CalendarCheck, t: "Book Instantly", d: "Send your request with the full price breakdown: hourly rate, hours and security deposit." },
  { icon: Clapperboard, t: "Create & Produce", d: "Once the host confirms, arrive, set up and make something great. Download your invoice anytime." },
];

const hostSteps = [
  { icon: ImagePlus, t: "List Your Space", d: "Add photos, amenities, capacity and your hourly rate in a few minutes." },
  { icon: BellRing, t: "Receive Requests", d: "Booking requests land in your dashboard with the guest, date and total." },
  { icon: BadgeCheck, t: "Confirm Your Slots", d: "Approve what suits you. Overlapping confirmed bookings are blocked automatically." },
  { icon: Wallet, t: "Host & Earn", d: "Welcome verified creators and turn idle hours into steady income." },
];

const faqs = [
  { q: "Do I need an account to browse studios?", a: "No. Anyone can explore listings and read reviews. You only need an account to book a space or list your own." },
  { q: "What happens after I send a booking request?", a: "Your booking is marked Pending until the host confirms it. You can cancel any Pending booking from My Bookings." },
  { q: "Can two people book the same time slot?", a: "No. Once a booking is confirmed, any overlapping request for that studio is rejected with a clear message." },
  { q: "What is the security deposit?", a: "It's a refundable amount set by the host to cover accidental damage. It is shown in your total before you confirm." },
  { q: "How do I list my own studio?", a: "Log in, open Add New Studio from your profile menu, fill in the details and publish. You can edit or delete it from My Studio Listings." },
];

function Steps({ steps }: { steps: typeof creatorSteps }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
      {steps.map(({ icon: I, t, d }, i) => (
        <div key={t} className="card bg-base-200 p-6 h-full">
          <span className="text-primary text-sm font-bold">Step {i + 1}</span>
          <I className="text-primary my-3" size={32} />
          <h3 className="font-bold text-lg">{t}</h3>
          <p className="text-sm text-base-content/70 mt-1">{d}</p>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="section-title">How StudioSpace Works</h1>
          <p className="section-sub mx-auto">
            From finding the right room to wrapping your session, booking a creative space takes a few clear steps.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="section-title">For Creators</h2>
        <p className="section-sub">Photographers, filmmakers, podcasters and musicians: here's your path to the shoot.</p>
        <Steps steps={creatorSteps} />
        <div className="mt-8">
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">For Hosts</h2>
          <p className="section-sub">Own a space that sits empty between projects? Put it to work.</p>
          <Steps steps={hostSteps} />
          <div className="mt-8">
            <Link href="/add-studio" className="btn btn-primary">Host Your Space</Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" defaultChecked={i === 0} aria-label={f.q} />
              <div className="collapse-title font-semibold">{f.q}</div>
              <div className="collapse-content text-base-content/70 text-sm">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}