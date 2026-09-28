import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import LegalCategories from "@/components/home/LegalCategories";
import TopExperts from "@/components/home/TopExperts";
import Hero from "@/components/sections/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">

      <Hero />

      <div className="container-page py-10 max-w-7xl mx-auto px-2 sm:px-5">
        <FeaturedLawyers />
        <TopExperts />
        <LegalCategories />
      </div>

    </div>
  );
}
