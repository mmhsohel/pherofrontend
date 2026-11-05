"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Building2, MapPin, DollarSign, ShieldCheck, Users, Link2, ImagePlus,
  Check, Mail, User, Sparkles, Tag, FileText, Camera, ChevronDown,
} from "lucide-react";
import PrivateGuard from "@/components/PrivateGuard";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { uploadAction } from "@/lib/upload";

const AMENITIES = ["WiFi", "Parking", "Green Room", "Cyc Wall", "Soundproofing", "Lighting Kit", "Air Conditioning", "Kitchenette"];
const CATS = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];
const MAX_OVERVIEW = 1000;

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border-2 border-base-300 bg-base-100 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-base-content/40";

function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ElementType;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <div className="p-6 sm:p-7 space-y-5">
        <div className="flex items-start gap-3.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-base-content">{title}</h2>
            {hint && <p className="text-sm text-base-content/55 mt-0.5">{hint}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-base-content/80 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EditStudioForm() {
  const { data } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [urlPreview, setUrlPreview] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [overviewLen, setOverviewLen] = useState(0);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    hourlyRate: "",
    deposit: "",
    capacity: "",
    overview: "",
    image: "",
  });

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        const studio = await api(`/studios/${id}`);
        if (cancelled) return;

        setForm({
          title: studio.title || "",
          category: studio.category || "",
          location: studio.location || "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          deposit: String(studio.deposit ?? ""),
          capacity: String(studio.capacity ?? ""),
          overview: studio.overview || "",
          image: studio.image || "",
        });
        setAmenities(Array.isArray(studio.amenities) ? studio.amenities : []);
        setUrlPreview(studio.image || "");
        setOverviewLen((studio.overview || "").length);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load studio");
        router.push("/my-listings");
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFilePreview(file && file.size > 0 ? URL.createObjectURL(file) : "");
  };

  const preview = filePreview || urlPreview;

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((p) => ({ ...p, [key]: value }));
      if (key === "overview") setOverviewLen(value.length);
      if (key === "image") setUrlPreview(value.trim());
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);

    try {
      let image = (f.get("imageUrl") as string) || form.image;
      const file = f.get("imageFile") as File;

      if (file && file.size > 0) {
        image = await uploadAction(file);
      }

      if (!image) throw new Error("Please add an image URL or upload a file");

      await api(`/studios/${id}`, {
        method: "PUT",
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
        }),
      });

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen grid place-items-center bg-base-200/50">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="mb-9">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
            <Sparkles size={12} />
            Edit listing
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">Update Studio</h1>
          <p className="mt-2 text-base text-base-content/60 max-w-lg">
            Keep details accurate so creators know exactly what to expect.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Section icon={Building2} title="Studio basics" hint="The name, type and location creators will search for.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Studio title" className="md:col-span-2">
                <input
                  name="title"
                  required
                  value={form.title}
                  onChange={set("title")}
                  placeholder="e.g. Northlight Cyc Wall Studio"
                  className={inputCls}
                />
              </Field>

              <Field label="Category">
                <div className="relative">
                  <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={set("category")}
                    className={`${inputCls} appearance-none pl-10 pr-10 cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                  />
                </div>
              </Field>

              <Field label="Location / address">
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    name="location"
                    required
                    value={form.location}
                    onChange={set("location")}
                    placeholder="City, State"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </Section>

          <Section icon={DollarSign} title="Pricing & capacity" hint="Transparent pricing builds trust with guests.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Hourly rate ($)">
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    name="hourlyRate"
                    type="number"
                    min={1}
                    required
                    value={form.hourlyRate}
                    onChange={set("hourlyRate")}
                    placeholder="65"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Security deposit ($)">
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    name="deposit"
                    type="number"
                    min={0}
                    required
                    value={form.deposit}
                    onChange={set("deposit")}
                    placeholder="100"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Max capacity">
                <div className="relative">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    name="capacity"
                    type="number"
                    min={1}
                    required
                    value={form.capacity}
                    onChange={set("capacity")}
                    placeholder="10"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </Section>

          <Section icon={Camera} title="Cover photo" hint="Paste an image link or upload a file. Upload takes priority.">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <Field label="Image URL">
                  <div className="relative">
                    <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                    <input
                      name="imageUrl"
                      type="url"
                      value={urlPreview}
                      placeholder="https://..."
                      className={`${inputCls} pl-10`}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        setUrlPreview(v);
                        setForm((p) => ({ ...p, image: v }));
                      }}
                    />
                  </div>
                </Field>

                <div className="flex items-center gap-3 text-xs text-base-content/40">
                  <span className="h-px flex-1 bg-base-300" />
                  OR
                  <span className="h-px flex-1 bg-base-300" />
                </div>

                <Field label="Upload from device">
                  <input
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="file-input file-input-bordered border-2 border-base-300 w-full h-11"
                  />
                </Field>
              </div>

              <div className="relative h-48 md:h-full min-h-48 rounded-xl border-2 border-dashed border-base-300 bg-base-200/40 overflow-hidden grid place-items-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setUrlPreview("")}
                  />
                ) : (
                  <div className="text-center text-base-content/45 px-4">
                    <ImagePlus className="mx-auto mb-2 opacity-60" size={28} />
                    <p className="text-sm">Cover preview</p>
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section icon={Check} title="Amenities" hint={`${amenities.length} selected`}>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const on = amenities.includes(a);
                return (
                  <label
                    key={a}
                    className={`
                      flex items-center gap-1.5 cursor-pointer select-none rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-colors
                      ${on
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={(e) =>
                        setAmenities((p) =>
                          e.target.checked ? [...p, a] : p.filter((x) => x !== a)
                        )
                      }
                    />
                    {on && <Check size={13} strokeWidth={2.5} />}
                    {a}
                  </label>
                );
              })}
            </div>
          </Section>

          <Section icon={FileText} title="Detailed overview" hint="Describe size, equipment, vibe and what's included.">
            <textarea
              name="overview"
              required
              rows={5}
              maxLength={MAX_OVERVIEW}
              value={form.overview}
              onChange={set("overview")}
              placeholder="A 1,800 sq ft white cyclorama studio with north-facing windows, four strobe heads and a private makeup area..."
              className={`${inputCls} h-auto py-3 leading-relaxed resize-y min-h-[120px]`}
            />
            <p
              className={`text-xs text-right mt-1.5 tabular-nums ${
                overviewLen > MAX_OVERVIEW * 0.9 ? "text-warning" : "text-base-content/45"
              }`}
            >
              {overviewLen} / {MAX_OVERVIEW}
            </p>
          </Section>

          <Section icon={User} title="Host details" hint="Taken from your account — cannot be changed here.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Host name">
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    readOnly
                    value={data?.user.name || ""}
                    className={`${inputCls} pl-10 bg-base-200/70 cursor-not-allowed opacity-90`}
                  />
                </div>
              </Field>
              <Field label="Host email">
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    readOnly
                    value={data?.user.email || ""}
                    className={`${inputCls} pl-10 bg-base-200/70 cursor-not-allowed opacity-90`}
                  />
                </div>
              </Field>
            </div>
          </Section>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-full h-12 text-base font-semibold shadow-md shadow-primary/15 disabled:opacity-60"
          >
            {loading ? <span className="loading loading-spinner" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <PrivateGuard>
      <EditStudioForm />
    </PrivateGuard>
  );
}