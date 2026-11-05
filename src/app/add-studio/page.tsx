"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PrivateGuard from "@/components/PrivateGuard";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { uploadAction } from "@/lib/upload"; // Import your server action

const AMENITIES = ["WiFi", "Parking", "Green Room", "Cyc Wall", "Soundproofing", "Lighting Kit", "Air Conditioning", "Kitchenette"];
const CATS = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function Form() {
  const { data } = useSession();
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);

    try {
      let image = f.get("imageUrl") as string;
      const file = f.get("imageFile") as File;

      // If a file was uploaded, pass it to the Server Action
      if (file && file.size > 0) {
        console.warn("ADD_STUDIO_UPLOAD_V3: Starting server action upload");
        
        const uploadData = new FormData();
        uploadData.append("image", file);
        
        image = await uploadAction(uploadData); // Calls the server action!
      }

      if (!image) throw new Error("Please add an image URL or upload a file");

      await api("/studios", { 
        method: "POST", 
        body: JSON.stringify({
          title: f.get("title"), 
          category: f.get("category"), 
          hourlyRate: f.get("hourlyRate"),
          deposit: f.get("deposit"), 
          capacity: f.get("capacity"), 
          location: f.get("location"),
          image, 
          amenities, 
          overview: f.get("overview"),
        }) 
      });

      toast.success("Studio listed successfully!");
      router.push("/my-listings");
    } catch (err: any) { 
      toast.error(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="section-title">Add New Studio</h1>
      <form onSubmit={onSubmit} className="grid gap-4 mt-6 md:grid-cols-2">
        <input name="title" required placeholder="Studio title" className="input input-bordered md:col-span-2" />
        <select name="category" required className="select select-bordered">
          <option value="">Category</option>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="location" required placeholder="Location / address" className="input input-bordered" />
        <input name="hourlyRate" type="number" min={1} required placeholder="Hourly rate ($)" className="input input-bordered" />
        <input name="deposit" type="number" min={0} required placeholder="Security deposit ($)" className="input input-bordered" />
        <input name="capacity" type="number" min={1} required placeholder="Max capacity" className="input input-bordered" />
        <input name="imageUrl" type="url" placeholder="Image URL" className="input input-bordered" />
        <input name="imageFile" type="file" accept="image/*" className="file-input file-input-bordered md:col-span-2" />
        
        <div className="md:col-span-2">
          <p className="font-semibold mb-2">Amenities</p>
          <div className="flex flex-wrap gap-3">
            {AMENITIES.map((a) => (
              <label key={a} className="label cursor-pointer gap-2 border border-base-300 rounded-full px-3 py-1">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary checkbox-sm"
                  onChange={(e) => setAmenities((p) => e.target.checked ? [...p, a] : p.filter((x) => x !== a))} 
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        <textarea name="overview" required rows={5} placeholder="Detailed overview" className="textarea textarea-bordered md:col-span-2" />
        <input readOnly value={data?.user.name || ""} className="input input-bordered bg-base-200" />
        <input readOnly value={data?.user.email || ""} className="input input-bordered bg-base-200" />
        
        <button disabled={loading} className="btn btn-primary md:col-span-2">
          {loading ? <span className="loading loading-spinner" /> : "Publish Studio"}
        </button>
      </form>
    </div>
  );
}

export default function Page() { 
  return <PrivateGuard><Form /></PrivateGuard>; 
}