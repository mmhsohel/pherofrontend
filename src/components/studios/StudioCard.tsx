"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export type Studio = {
  _id: string; title: string; category: string; hourlyRate: number; image: string;
  rating: number; location: string; [k: string]: any;
};

export default function StudioCard({ studio, saved = false }: { studio: Studio; saved?: boolean }) {
  const { data } = useSession();
  const [liked, setLiked] = useState(saved);

  const toggle = async () => {
    if (!data?.user) return toast.info("Please log in to save studios");
    try {
      const res = await api("/wishlist/toggle", { method: "POST", body: JSON.stringify({ studioId: studio._id }) });
      setLiked(res.saved);
      toast.success(res.saved ? "Saved to wishlist" : "Removed from wishlist");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-xl transition h-full">
      <figure className="relative h-56 w-full">
        <Image src={studio.image} alt={studio.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="badge badge-primary absolute top-3 left-3">{studio.category}</span>
        <button onClick={toggle} aria-label="Save studio"
          className="btn btn-circle btn-sm absolute top-3 right-3 bg-base-100/80 border-0">
          <Heart size={16} className={liked ? "fill-primary text-primary" : ""} />
        </button>
      </figure>
      <div className="card-body p-5 flex flex-col">
        <h3 className="card-title line-clamp-1">{studio.title}</h3>
        <p className="flex items-center gap-1 text-sm text-base-content/70 line-clamp-1"><MapPin size={14} /> {studio.location}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-primary">${studio.hourlyRate} <span className="text-sm font-normal">/ hr</span></span>
          <span className="badge badge-outline gap-1"><Star size={12} className="fill-accent text-accent" />{studio.rating?.toFixed(1) || "New"}</span>
        </div>
        <div className="card-actions mt-auto pt-3">
          <Link href={`/studios/${studio._id}`} className="btn btn-primary w-full">View Details</Link>
        </div>
      </div>
    </div>
  );
}