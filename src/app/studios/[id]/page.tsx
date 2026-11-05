"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star, MapPin, Users, ShieldCheck, Clock, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import BookingModal from "@/components/studios/BookingModal";
import EmptyState from "@/components/studios/EmptyState";

const Stars = ({ value }: { value: number }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={16} className={n <= Math.round(value) ? "fill-accent text-accent" : "text-base-content/30"} />
    ))}
  </span>
);

function DetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="skeleton h-[420px] w-full" />
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-24 w-full" />
      </div>
      <div className="skeleton h-72 w-full" />
    </div>
  );
}

export default function StudioDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api(`/studios/${id}`)
      .then(setStudio)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailsSkeleton />;
  if (error || !studio)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState title="Studio not found" text="This listing may have been removed by its host." cta="Explore Studios" href="/studios" />
      </div>
    );

  const gallery: string[] = [studio.image, ...(studio.gallery || []).filter((g: string) => g !== studio.image)];
  const reviews: any[] = studio.reviews || [];
  const isOwner = user?.email === studio.ownerEmail;

  console.log("StudioDetails user:", studio);

  const book = () => {
    if (!user) {
      toast.info("Please log in to book this studio");
      return router.push(`/login?redirect=/studios/${id}`);
    }
    setOpen(true);
  };

  const specs = [
    { icon: Clock, label: "Hourly rate", value: `$${studio.hourlyRate} / hr` },
    { icon: ShieldCheck, label: "Security deposit", value: `$${studio.deposit}` },
    { icon: Users, label: "Max capacity", value: `${studio.capacity} people` },
    { icon: MapPin, label: "Location", value: studio.location },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="rounded-box w-full">
            {gallery.map((src, i) => (
              <SwiperSlide key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${studio.title} photo ${i + 1}`} className="w-full h-[280px] sm:h-[420px] object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div>
            <span className="badge badge-primary">{studio.category}</span>
            <h1 className="section-title mt-3">{studio.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-base-content/70">
              <span className="flex items-center gap-1"><MapPin size={16} /> {studio.location}</span>
              <span className="flex items-center gap-2">
                <Stars value={studio.rating || 0} />
                <span className="font-semibold text-base-content">{studio.rating ? studio.rating.toFixed(1) : "New"}</span>
                <span>({reviews.length} reviews)</span>
              </span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">Workspace specifications</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {specs.map(({ icon: I, label, value }) => (
                <div key={label} className="flex items-center gap-4 bg-base-200 rounded-box p-4">
                  <I className="text-primary shrink-0" size={26} />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-base-content/60">{label}</p>
                    <p className="font-semibold truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">About this space</h2>
            <p className="text-base-content/80 leading-relaxed whitespace-pre-line">{studio.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((a: string) => (
                  <li key={a} className="flex items-center gap-2"><Check size={18} className="text-success" /> {a}</li>
                ))}
              </ul>
            ) : <p className="text-base-content/70">The host has not listed any amenities.</p>}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Hosted by</h2>
            <div className="flex items-center gap-4 bg-base-200 rounded-box p-5">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content w-14 h-14 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold leading-none">{studio.ownerName?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg">{studio.ownerName}</p>
                <p className="text-sm text-base-content/70 truncate">{studio.ownerEmail}</p>
              </div>
              <a href={`mailto:${studio.ownerEmail}`} className="btn btn-outline btn-primary btn-sm"><Mail size={16} /> Contact</a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-base-200 rounded-box p-8 text-center text-base-content/70">
                No reviews yet. Be the first creator to book and share your experience.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-base-200 rounded-box p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-secondary text-secondary-content w-10 rounded-full">
                            <span>{r.userName?.[0]}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{r.userName}</p>
                          <p className="text-xs text-base-content/60">{r.date}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-3 text-base-content/80">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: sticky booking card */}
        <aside>
          <div className="card bg-base-200 shadow-lg p-6 lg:sticky lg:top-24">
            <p className="text-3xl font-extrabold text-primary">
              ${studio.hourlyRate}<span className="text-base font-normal text-base-content/70"> / hr</span>
            </p>
            <p className="text-sm text-base-content/70 mt-1">+ ${studio.deposit} refundable security deposit</p>
            <div className="divider my-3" />
            <ul className="text-sm space-y-2 text-base-content/80">
              <li className="flex items-center gap-2"><Users size={16} /> Up to {studio.capacity} people</li>
              <li className="flex items-center gap-2"><Star size={16} /> {studio.rating ? `${studio.rating.toFixed(1)} average rating` : "No ratings yet"}</li>
            </ul>
            <button onClick={book} disabled={isOwner} className="btn btn-primary w-full mt-5">
              {isOwner ? "This is your listing" : "Book Workspace Now"}
            </button>
            <p className="text-xs text-center text-base-content/60 mt-3">Your request stays pending until the host confirms.</p>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}