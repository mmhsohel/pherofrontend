"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();
  useEffect(() => { if (!isPending && !data?.user) router.replace("/login"); }, [isPending, data, router]);
  if (isPending || !data?.user)
    return <div className="min-h-[60vh] grid place-items-center"><span className="loading loading-ring loading-lg text-primary" /></div>;
  return <>{children}</>;
}