"use client";

import { motion, useTransform, MotionValue, useSpring } from "motion/react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { Line } from "@/components/ui/Line";
import { Instrument_Serif } from "next/font/google";
import { HOW_IT_WORKS_STEPS, transformsKeys } from "@/constants/Process";
const Feature = dynamic(() => import("./Feature"), { ssr: false });

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: "italic",
  subsets: ["latin"],
});

interface processProps {
  scrollYProgress: MotionValue<number>;
}

const Process = ({ scrollYProgress }: processProps) => {
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });

  const featureStep = useTransform(smoothScroll, [0.5, 0.7], ["100%", "0%"]);
  const opacity1 = useTransform(smoothScroll, [0.3, 0.45], [1, 0]);

  // headline animations
  const headline1Opacity = useTransform(smoothScroll, [0.4, 0.5], [1, 0]);
  const headline2Opacity = useTransform(smoothScroll, [0.5, 0.6], [0, 1]);
  const headline1Y = useTransform(smoothScroll, [0.2, 0.5], ["0%", "-30%"]);
  const headline2Y = useTransform(smoothScroll, [0.5, 0.55], ["30%", "0%"]);

  const cardTransform1 = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    ["0%", "-150%"]
  );

  const cardTransform2 = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    ["0%", "15%"]
  );
  const cardTransform3 = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    ["0%", "150%"]
  );

  const transforms: Record<keyof typeof transformsKeys, MotionValue<string>> = {
    cardTransform1,
    cardTransform2,
    cardTransform3,
  };

  return (
    <>
      <motion.section
        id="how"
        className="sticky top-0 pt-10 overflow-x-clip z-20  "
      >
        <div className="mx-auto w-11/12 ">
          {/* Heading */}
          <div className="flex flex-col justify-center items-center lg:gap-4">
            <div className="flex items-center gap-2">
              <Line
                variant="gradient"
                className="rotate-180 w-10"
                thickness="xs"
              />
              <span
                className={`${instrumentSerif.className} relative overflow-hidden  lg:text-[0.8rem] tracking-wider text-faint-text`}
              >
                <motion.p
                  className=""
                  style={{
                    opacity: headline1Opacity,
                    y: headline1Y,
                  }}
                >
                  Our Process,Explained
                </motion.p>
                <motion.p
                  className=" absolute top-0"
                  style={{ y: headline2Y, opacity: headline2Opacity }}
                >
                  {" "}
                  Our Features, Defined
                </motion.p>
              </span>
              <Line variant="gradient" thickness="xs" className="w-10" />
            </div>
            <div className="lg:text-2xl overflow-hidden relative">
              <motion.h1 style={{ y: headline1Y, opacity: headline1Opacity }}>
                Here's how it works
              </motion.h1>
              <motion.h1
                style={{ y: headline2Y, opacity: headline2Opacity }}
                className="w-full absolute text-center top-0"
              >
                Features
              </motion.h1>
            </div>
          </div>
          {/* clip path */}

          {/* card */}
          <Card className=" w-11/12 mx-auto lg:mt-8 perspective-distant rounded-4xl p-1  xl:h-[25rem] border-none bg-surface/30  shadow-lg shadow-black/30">
            <motion.div className="relative w-full h-full bg-card-background rounded-4xl overflow-clip">
              {/* How it works card's */}
              <motion.div
                className="w-full h-full p-10 relative flex justify-center"
                style={{ opacity: opacity1 }}
              >
                {HOW_IT_WORKS_STEPS.map(
                  ({ id, step, headline, content, zIndex, xKey, yKey }) => (
                    <motion.div
                      key={id}
                      className={`absolute z-${zIndex} w-[22%] h-[calc(100%_-_130px)]`}
                      style={{
                        x: xKey && transforms[xKey],
                        y: yKey && transforms[yKey],
                      }}
                    >
                      <Card className="bg-surface/10 border-none h-full w-full rounded-4xl p-2 shadow-black/40 shadow-xl backdrop-blur-2xl">
                        <motion.div className="bg-surface h-full w-full rounded-4xl p-6 flex flex-col justify-between">
                          <div className="lg:text-6xl">{step}</div>
                          <div className="flex flex-col gap-5">
                            <div className="lg:text-xl font-bold">
                              {headline}
                            </div>
                            <div className="lg:text-[0.6rem] tracking-wide text-faint-text">
                              {content}
                            </div>
                          </div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )
                )}
              </motion.div>

              {/* Step 2 */}
              <motion.div
                style={{ y: featureStep }}
                className="absolute inset-0 flex  text-white z-40"
              >
                <Feature />
              </motion.div>
            </motion.div>
          </Card>
        </div>
      </motion.section>
    </>
  );
};

export default Process;
