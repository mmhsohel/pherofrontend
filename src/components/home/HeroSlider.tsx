"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css"; import "swiper/css/pagination"; import "swiper/css/effect-fade";

const slides = [
  { img: "/images/hero/1.jpeg", h: "Light Your Next Shoot", p: "Cyc walls, natural-light lofts and pro lighting rigs, bookable by the hour." },
  { img: "/images/hero/2.jpeg", h: "Record Where Music Is Made", p: "Treated rooms, vintage consoles and isolation booths ready when you are." },
  { img: "/images/hero/3.jpeg", h: "Turn Your Space Into Income", p: "List your studio, set your rate, and welcome verified creators." },
  { img: "/images/hero/4.jpg", h: "Your Voice Deserves a Great Room", p: "Soundproofed podcast lounges with pro microphones, ready for your next episode." },
  { img: "/images/hero/5.jpg", h: "From Script to Soundstage", p: "Book full production stages with grid lighting, green screens and power on tap." },
  { img: "/images/hero/6.jpg", h: "Make Something With Your Hands", p: "Art workshops with wheels, kilns and open benches, available by the hour." },
  { img: "/images/hero/7.jpg", h: "Where Creative Teams Come Together", p: "Find a space that fits your crew, your gear and your budget, then book it in minutes." },
];

export default function HeroSlider() {
  return (
    <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade" autoplay={{ delay: 4500 }} pagination={{ clickable: true }} loop className="h-[70vh] min-h-[480px]">
      {slides.map((s) => (
        <SwiperSlide key={s.h}>
          <div className="relative h-full bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold max-w-2xl">{s.h}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">{s.p}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                <Link href="/studios" className="btn btn-outline text-white border-white hover:bg-white hover:text-black">Host Your Space</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}