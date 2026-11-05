import { Suspense } from "react";
import { connection } from "next/server";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioSkeleton from "@/components/studios/StudioSkeleton";
import Categories from "@/components/home/Categories";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

export default async function Home() {
  // Allow dynamic values (Date.now / new Date) used inside FeaturedStudios
  await connection();

  return (
    <>
      <HeroSlider />
      <Suspense
        fallback={
          <section className="max-w-7xl mx-auto px-4 py-16">
            <StudioSkeleton count={6} />
          </section>
        }
      >
        <FeaturedStudios />
      </Suspense>
      <Categories />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}