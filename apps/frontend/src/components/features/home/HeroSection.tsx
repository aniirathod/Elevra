"use client";

import { ShineBorder } from "@/components/animation/ShineBorder";
import { Card } from "@/components/ui/Card";
import { Poppins, Roboto } from "next/font/google";
import { MoveRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const buttons = [
  { label: "Analyzer", path: "analyze" },
  { label: "Builder", path: "analyze" },
];

const HeroSection = () => {
  return (
    <>
      <section id="home" className="">
        <div className="mx-auto relative w-11/12">
          {/* Right Side Evolve Text */}
          <div className="absolute top-[calc(100%_-_85%)] w-full h-[calc(100%_-_2rem)] hidden justify-end md:flex ">
            <h1
              className={`${poppins.className} flex flex-col items-center md:text-[13rem] lg:text-[8.3rem] xl:text-[7.5rem] font-bold tracking-wider md:text-white/1 lg:text-white/3 select-none pointer-events-none`}
            >
              {["E", "V", "O", "L", "V", "E"].map((char, index) => (
                <div
                  key={index}
                  className="rotate-90 md:leading-[9.5rem] lg:leading-[6rem] xl:leading-[5.5rem]"
                >
                  {char}
                </div>
              ))}
            </h1>
          </div>

          {/* middle Text */}
          <div className="flex flex-col items-center pt-[30rem] xs:pt-[25rem] l:pt-[20rem] sm:pt-[15rem] md:pt-48 lg:pt-26 gap-28 xs:gap-20 lg:gap-7">
            {/* Powered By AI- Text */}
            <div className="relative overflow-hidden text-5xl xs:text-4xl sm:text-3xl lg:text-[0.7rem] px-30 py-12 xs:px-10 xs:py-4 md:py-2 xm:px-16 xl:px-12  rounded-full shadow-md shadow-black/30 border-white/20">
              Powered By AI
              <ShineBorder
                shineColor={`var(--color-secondary)`}
                borderWidth={0.4}
              />
            </div>
            {/* Headline */}
            <div
              className={`${roboto.className} text-[15rem] xm:text-[14rem] l:text-[10rem] md:text-[7rem] lg:text-[6rem] xl:text-[4.7rem] leading-none font-bold`}
            >
              <div className="flex justify-center items-center gap-10 lg:gap-4">
                <h1 className="text-white/80 ">Build</h1>
                <Card className="h-40 w-48 sm:h-32 sm:w-40 md:h-24 md:w-32 lg:w-30 lg:h-20 xl:w-18 xl:h-14 bg-surface rounded-4xl md:rounded-2xl border-none flex justify-center items-center">
                  <img
                    src="/icons/build.svg"
                    className="w-20 h-20 sm:w-18 sm:h-18 lg:w-12 lg:h-12 xl:w-9 xl:h-9 object-contain"
                  />
                </Card>
              </div>
              <div className="flex items-center justify-center gap-10 lg:gap-4">
                <Card className=" h-40 w-48 sm:h-32 sm:w-40 md:h-24 md:w-32 lg:w-30 lg:h-20 xl:w-18 xl:h-14 bg-surface rounded-4xl md:rounded-2xl border-none flex justify-center items-center">
                  <img
                    src="/icons/resume.svg"
                    className="w-20 h-20 sm:w-18 sm:h-18 lg:w-12 lg:h-12 xl:w-9 xl:h-9  object-contain"
                  />
                </Card>
                <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-white to-surface/50">
                  Analyze
                </h1>
              </div>
              <div className="flex items-center justify-center gap-10 lg:gap-4">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[#717171] to-[#545454]">
                  Get Hired
                </h1>
                <Card className="h-40 w-48 sm:h-32 sm:w-40 md:h-24 md:w-32 lg:w-30 lg:h-20 xl:w-18 xl:h-14 bg-surface rounded-4xl md:rounded-2xl border-none flex justify-center items-center">
                  <img
                    src="/icons/handshake.svg"
                    className="w-20 h-20 sm:w-18 sm:h-18 lg:w-12 lg:h-12 xl:w-9 xl:h-9 object-contain"
                  />
                </Card>
              </div>
            </div>

            {/* sub headline */}
            <div className="w-full xs:w-[80%] sm:w-[70%] lg:w-6/12 xl:w-[43%] mx-auto">
              <p className="text-center text-foreground/60 text-[2.5rem] l:text-[1.7rem] sm:text-[1.5rem] md:text-[1rem] xl:text-[0.82rem]">
                Elevra’s AI-powered resume builder analyzes every line to craft
                a standout, ATS-optimized resume that impresses employers.
              </p>
            </div>
          </div>

          {/* Buttons in the bottom left side */}
          <div className="py-42 md:py-28 lg:py-12 flex gap-20 md:gap-10 lg:gap-5 justify-center lg:justify-start">
            {buttons.map(({ label, path }) => (
              <Link href={path}>
                <motion.div
                  key={label}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                  className="relative group hover:cursor-pointer bg-white/5 w-fit px-24 py-4 xs:px-20 xs:py-3 md:px-8 md:py-2 lg:px-5 lg:py-3 xl:px-3 xl:py-1 gap-16 xl:gap-4 rounded-full border border-white/10 flex items-center justify-between shadow-lg shadow-black/30 backdrop-blur-2xl overflow-hidden"
                >
                  {/* Background shine on hover */}
                  <motion.div
                    className="absolute w-full h-full bg-linear-120 from-transparent via-secondary/10 to-transparent top-0 left-0 opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <div className=" absolute top-0 left-0 group hover:cursor-pointer bg-white/5 w-full h-full rounded-full border border-white/10 flex items-center shadow-lg shadow-black/30 backdrop-blur-lg"></div>

                  {/* Label */}
                  <span className="z-10 tracking-wider text-white/90 text-4xl md:text-[1.4rem] lg:text-[1.2rem] xl:text-[0.7rem]">
                    {label}
                  </span>

                  {/* Icon */}
                  <motion.div className="relative -z-10 bg-secondary p-8 xm:p-7 xs:p-5 md:p-4 lg:p-2 xl:p-1 rounded-full group-hover:cursor-pointer group-hover:-rotate-45 transition-all duration-200">
                    <MoveRight className="text-white w-18 h-18 xm:h-10 xm:w-10 md:h-7 md:w-7 lg:h-5 lg:w-5" />
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
