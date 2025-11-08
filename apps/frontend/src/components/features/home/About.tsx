"use client";

import ScrollReveal from "@/components/animation/ScrollReveal";
import { Line } from "@/components/ui/Line";
import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: "italic",
  subsets: ["latin"],
});

const About = () => {
  return (
    <>
      <section id="about" className="py-20">
        <div>
          <div className="relative w-11/12 mx-auto flex flex-col items-center gap-10  pt-[30rem] xs:pt-[25rem] l:pt-[20rem] sm:pt-[15rem] md:pt-48 lg:pt-26 xl:pt-0  xl:mt-26">
            {/* Headline */}
            <motion.div className="flex items-center gap-2">
              <Line
                variant="gradient"
                className="rotate-180 w-10"
                thickness="xs"
              />
              <span
                className={`${instrumentSerif.className} relative overflow-hidden  lg:text-[1.2rem] tracking-wider text-faint-text`}
              >
                <motion.p className="">Why we Exist</motion.p>
              </span>
              <Line variant="gradient" thickness="xs" className="w-10" />
            </motion.div>

            <motion.div className=" w-7/12 mx-auto font-light text-center">
              <ScrollReveal
                start="top 80%"
                end="top 50%"
                textClassName="text-[2rem] leading-relaxed tracking-wider"
              >
                Elevera helps you build smarter resumes by showing what truly
                makes them stand out.
              </ScrollReveal>
            </motion.div>
            <div className=" absolute top-16 right-26">
              <img
                src="/icons/resumeSkelton.svg"
                alt="resume skelton"
                className="w-24 h-24"
              />
            </div>
            <div className=" absolute top-16 left-26 -scale-x-100">
              <img
                src="/icons/resumeSkelton.svg"
                alt="resume skelton"
                className="w-24 h-24 "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
