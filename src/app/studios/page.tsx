"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StudioCard, { Studio } from "@/components/studios/StudioCard";
import StudioSkeleton from "@/components/studios/StudioSkeleton";
import EmptyState from "@/components/studios/EmptyState";
import { api } from "@/lib/api";
import { toast } from "sonner";

const CATS = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function Explore() {
  const params = useSearchParams();
  
  // 1. Initialize state from URL params
  const [category, setCategory] = useState(params.get("category") || "All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔑 2. CRITICAL: Listen to URL param changes (when clicking category links from home/elsewhere)
  useEffect(() => {
    const urlCategory = params.get("category");
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory("All");
    }
  }, [params]);

  // Fetch studios whenever category, search, or sort changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ category, search, sort }).toString();
      api<Studio[]>(`/studios?${qs}`)
        .then(setStudios)
        .catch((e) => toast.error(e.message))
        .finally(() => setLoading(false));
    }, 300); // debounce
    
    return () => clearTimeout(t);
  }, [category, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="section-title">Explore Studios</h1>
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name or location"
          className="input input-bordered flex-1" 
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="select select-bordered"
        >
          {CATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered">
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>
      <div className="mt-8">
        {loading ? (
          <StudioSkeleton />
        ) : studios.length === 0 ? (
          <EmptyState title="No studios match your search" text="Try a different keyword or category." cta="Clear Filters" href="/studios" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() { 
  return <Suspense><Explore /></Suspense>; 
}