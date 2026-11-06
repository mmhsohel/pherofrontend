"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import { api } from "@/lib/api";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" }, { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" }, { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;
  console.log("Navbar user:", user);

  const logout = async () => {
    await api("/server-auth/logout", { method: "POST" }).catch(() => {});
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const nav = links.map((l) => (
    <li key={l.href}>
      <Link href={l.href}
        className={path === l.href ? "text-primary font-semibold border-b-2 border-primary rounded-none" : ""}>
        {l.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle"><Menu /></div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow">{nav}</ul>
          </div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold">
            <Image src="/logo-mark-512.jpg" alt="StudioSpace Logo" width={50} height={50} className="rounded-full" />
             Studio<span className="text-primary">Space</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex"><ul className="menu menu-horizontal gap-1">{nav}</ul></div>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          {isPending ? <div className="skeleton w-10 h-10 rounded-full" /> : user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar cursor-pointer" title={user.name}>
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <Image src={user.image || "/default-avatar.jpg"} alt={user.name} width={40} height={40} className="rounded-full" />
                </div>
              </div>
              <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-60 p-2 shadow-lg border border-base-300">
                <li className="menu-title text-base-content">{user.name}</li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/add-studio">Add New Studio</Link></li>
                <li><Link href="/my-listings">My Studio Listings</Link></li>
                <li><Link href="/my-bookings">My Bookings</Link></li>
                <li><button onClick={logout} className="text-error">Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-primary btn-sm md:btn-md">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm md:btn-md">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}