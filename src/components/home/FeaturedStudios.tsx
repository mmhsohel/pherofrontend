import Link from "next/link";
import StudioCard, { Studio } from "../studios/StudioCard";

export default async function FeaturedStudios() {
  let studios: Studio[] = [];
  try {
    const res = await fetch(`${process.env.API_URL}/api/studios?limit=6&sort=rating`, { cache: "no-store" });
    studios = await res.json();
  } catch {}
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="section-title">Featured Studios</h2>
      <p className="section-sub">Top-rated spaces our creators keep coming back to.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
      </div>
      <div className="text-center mt-10"><Link href="/studios" className="btn btn-primary">Explore All Studios</Link></div>
    </section>
  );
}