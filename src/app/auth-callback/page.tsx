"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { issueJwt } from "@/lib/auth-client";
import { toast } from "sonner";

function Callback() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  useEffect(() => {
    issueJwt().then(() => { toast.success("Signed in with Google"); router.replace(redirect); });
  }, [router, redirect]);
  return <div className="min-h-[60vh] grid place-items-center"><span className="loading loading-ring loading-lg text-primary" /></div>;
}
export default function Page() { return <Suspense><Callback /></Suspense>; }