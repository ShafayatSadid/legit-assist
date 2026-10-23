import Hero from "@/components/sections/Hero";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import TopExperts from "@/components/home/TopExperts";
import LegalCategories from "@/components/home/LegalCategories";
import HowItWorks from "@/components/home/HowItWorks";
import PlatformStats from "@/components/home/PlatformStats";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  return (
    <div className="">
      <Hero />
      
      <div className="container-page py-10 max-w-7xl mx-auto px-2 sm:px-5">
        <FeaturedLawyers />
        <LegalCategories />
        <HowItWorks />
      </div>
      
      <PlatformStats />
      
      <div className="container-page py-10 max-w-7xl mx-auto px-2 sm:px-5">
        <Testimonials />
        <FAQ />
      </div>
    </div>
  );
}