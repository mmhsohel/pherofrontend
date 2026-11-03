// not-found.tsx
import Link from "next/link";
import { Clapperboard } from "lucide-react";
export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4">
      <div>
        <Clapperboard size={96} className="mx-auto text-primary" />
        <h1 className="text-6xl font-extrabold mt-4">404</h1>
        <p className="text-xl mt-2">Cut! This scene isn't on the call sheet.</p>
        <Link href="/" className="btn btn-primary mt-6">Return to Home</Link>
      </div>
    </div>
  );
}