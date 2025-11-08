"use client";

import HeroSection from "@/components/features/home/HeroSection";
import Process from "@/components/features/home/Process";
import Navbar from "@/components/layout/Navbar";
import { useScroll, motion, useTransform } from "motion/react";
import { useRef } from "react";
import { SECTION_HEIGHT } from "@/constants/Process";
import About from "@/components/features/home/About";
import { Line } from "@/components/ui/Line";
import CurvedLoop from "@/components/ui/CurvedLoop";
import Footer from "@/components/layout/Footer";

const Home = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <>
      <div className="w-full bg-linear-123 from-30% from-background via-35% via-background-part-one to-40% to-background">
        <Navbar />
        <HeroSection />
        <div
          className="relative"
          style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
          ref={ref}
        >
          <Process scrollYProgress={scrollYProgress} />
        </div>
        <About />
        <div className=" py-10">
          <CurvedLoop
            marqueeText="Build ATS-Optimized Resumes ✦ Get Your Free AI Analysis"
            interactive={true}
            curveAmount={100}
            className=" fill-white/60"
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
