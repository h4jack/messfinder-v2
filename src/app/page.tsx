import { Header } from "@/components/layout";
import HeroSearch from "@/components/section/HeroSearch";

import FeaturedRooms from "@/components/section/FeaturedRooms";
// import WhyChooseUs from "@/components/section/WhyUs";
// import PopularLocalities from "@/components/section/PopularLocalities";
// import Testimonials from "@/components/section/Testimonials";
// import CTA from "@/components/section/CTA";
// import HowItWorks from "@/components/section/HowItWorks";;


export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-br from-teal-50 to-white min-h-screen">
        <Header />
        <HeroSearch />

        <FeaturedRooms />
        {/*
        <HowItWorks />
        <PopularLocalities />
        <WhyChooseUs />
        <Testimonials />
        <CTA /> */}
        
        {/*
        What else you should include in the home page..
          Header
          Search Section
          Featured Rooms
          How it Works Section
          Testimonials Section
          Footer

        */}
      </div>
    </>
  );
}
