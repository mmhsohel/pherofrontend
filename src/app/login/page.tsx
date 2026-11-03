"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { signIn, issueJwt } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await signIn.email({ email: f.get("email") as string, password: f.get("password") as string });
    if (error) { toast.error(error.message || "Invalid email or password"); setLoading(false); return; }
    await issueJwt();
    toast.success("Welcome back to StudioSpace!");
    router.push(redirect);
    router.refresh();
  };

  const google = () => signIn.social({ provider: "google", callbackURL: `/auth-callback?redirect=${redirect}` });

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card bg-base-200 shadow-xl p-8">
        <h1 className="section-title text-center">Login to StudioSpace</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
          <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />
          <Link href="#" className="link link-primary text-sm">Forgot Password?</Link>
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner" /> : "Login"}
          </button>
        </form>
        <div className="divider">OR</div>
        <button onClick={google} className="btn btn-outline w-full"><FcGoogle size={22} /> Continue with Google</button>
        <p className="text-center text-sm mt-4">New here? <Link href="/register" className="link link-primary">Register</Link></p>
      </div>
    </div>
  );
}
export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }