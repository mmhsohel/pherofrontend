import Link from "next/link";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import CurrentYear from "./CurrentYear";
import Image from "next/image";

const cats = ["Photo Studios", "Sound Stages", "Podcast Rooms", "Music Suites", "Art Workshops"];

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold">
            <Image src="/logo-mark-512.jpg" alt="Logo" width={48} height={48} />
               Studio<span className="text-primary">Space</span>
          </Link>
          <p className="mt-3 text-sm text-base-content/70">
            Our mission is to put every creator in the right room — from cyc walls to soundproof suites — with fair, transparent pricing.
          </p>
          <div className="flex gap-3 mt-4 text-xl">
            <a href="https://x.com" aria-label="X" className="hover:text-primary"><FaXTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-primary"><FaInstagram /></a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-primary"><FaYoutube /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-primary"><FaLinkedinIn /></a>
          </div>
        </div>
        <div>
          <h6 className="font-bold mb-3">Quick Links</h6>
          <ul className="space-y-2 text-sm">
            {[["/", "Home"], ["/studios", "Explore Studios"], ["/how-it-works", "How It Works"], ["/about", "About Us"]].map(([h, l]) =>
              <li key={h}><Link className="hover:text-primary" href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h6 className="font-bold mb-3">Popular Categories</h6>
          <ul className="space-y-2 text-sm">
            {cats.map((c) => <li key={c}><Link className="hover:text-primary" href={`/studios?category=${encodeURIComponent(c)}`}>{c}</Link></li>)}
          </ul>
        </div>
        <div>
          <h6 className="font-bold mb-3">Newsletter</h6>
          <form className="join w-full" action="#">
            <input type="email" required placeholder="you@email.com" className="input input-bordered join-item w-full" />
            <button className="btn btn-primary join-item">Join</button>
          </form>
          <p className="text-xs mt-2 text-base-content/60">Monthly studio drops and host tips. No spam.</p>
        </div>
      </div>
      <div className="border-t border-base-300 py-4 text-center text-xs text-base-content/60">
       © <CurrentYear /> StudioSpace. All rights reserved.
        </div>
    </footer>
  );
}