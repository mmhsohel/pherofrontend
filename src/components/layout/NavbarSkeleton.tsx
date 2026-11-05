import { Aperture } from "lucide-react";

export default function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <span className="flex items-center gap-2 text-2xl font-extrabold">
            <Aperture className="text-primary" size={30} /> Studio<span className="text-primary">Space</span>
          </span>
        </div>
        <div className="navbar-end gap-2">
          <div className="skeleton w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
  );
}