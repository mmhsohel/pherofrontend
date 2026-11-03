import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";

const cats = [
  { name: "Photo Studios", value: "Photo Studio", icon: Camera },
  { name: "Sound Stages", value: "Film Stage", icon: Clapperboard },
  { name: "Podcast Rooms", value: "Podcast Lounge", icon: Mic },
  { name: "Music Suites", value: "Music Suite", icon: Music },
  { name: "Art Workshops", value: "Workshop", icon: Palette },
];

export default function Categories() {
  return (
    <section className="bg-base-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Browse by Category</h2>
        <p className="section-sub">Pick a craft and we'll show the rooms built for it.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {cats.map(({ name, value, icon: Icon }) => (
            <Link key={value} href={`/studios?category=${encodeURIComponent(value)}`}
              className="card bg-base-100 hover:bg-primary hover:text-primary-content transition p-6 items-center text-center h-40 justify-center shadow">
              <Icon size={36} /><span className="font-semibold mt-3">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}