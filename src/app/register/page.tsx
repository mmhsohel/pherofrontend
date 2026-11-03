"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [pwError, setPwError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (p: string) =>
    !/[A-Z]/.test(p) ? "Password must contain an uppercase letter"
    : !/[a-z]/.test(p) ? "Password must contain a lowercase letter"
    : p.length < 6 ? "Password must be at least 6 characters" : "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = f.get("password") as string;
    const err = validate(password);
    setPwError(err);
    if (err) return toast.error(err);
    setLoading(true);
    const { error } = await signUp.email({
      name: f.get("name") as string, email: f.get("email") as string,
      image: f.get("photo") as string, password,
    });
    setLoading(false);
    if (error) return toast.error(error.message || "Registration failed");
    toast.success("Account created! Please log in.");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card bg-base-200 shadow-xl p-8">
        <h1 className="section-title text-center">Create Your Account</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Full name" className="input input-bordered w-full" />
          <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
          <input name="photo" type="url" required placeholder="Photo URL" className="input input-bordered w-full" />
          <div>
            <input name="password" type="password" required placeholder="Password"
              className={`input input-bordered w-full ${pwError ? "input-error" : ""}`}
              onChange={(e) => setPwError(validate(e.target.value))} />
            {pwError && <p className="text-error text-sm mt-1">{pwError}</p>}
          </div>
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner" /> : "Register"}
          </button>
        </form>
        <div className="divider">OR</div>
        <button onClick={() => signIn.social({ provider: "google", callbackURL: "/auth-callback" })}
          className="btn btn-outline w-full"><FcGoogle size={22} /> Continue with Google</button>
        <p className="text-center text-sm mt-4">Already a member? <Link href="/login" className="link link-primary">Login</Link></p>
      </div>
    </div>
  );
}