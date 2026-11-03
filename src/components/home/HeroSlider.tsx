"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css"; import "swiper/css/pagination"; import "swiper/css/effect-fade";

const slides = [
  { img: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1600", h: "Light Your Next Shoot", p: "Cyc walls, natural-light lofts and pro lighting rigs, bookable by the hour." },
  { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600", h: "Record Where Music Is Made", p: "Treated rooms, vintage consoles and isolation booths ready when you are." },
  { img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1600", h: "Turn Your Space Into Income", p: "List your studio, set your rate, and welcome verified creators." },
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