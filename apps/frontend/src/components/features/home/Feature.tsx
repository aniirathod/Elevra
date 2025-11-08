import { MoveRight } from "lucide-react";
import { motion } from "motion/react";

const Feature = () => {
  return (
    <section id="features">
      <div className="px-10 py-4 grid grid-cols-2 ">
        <div>
          <div className="w-full pb-[1.45rem] border-b border-faint-text">
            <h1 className="lg:text-4xl tracking-wider font-semibold w-8/12 leading-snug ">
              Resumes built with insight, not guesswork.
            </h1>
          </div>

          <div className="pt-10 flex gap-4 text-2xl pb-8 border-b border-faint-text">
            <span>Real-time AI Feedback</span>
            <span className="text-[0.7rem]">01</span>
          </div>
          <div className="pt-10 flex gap-4 text-2xl">
            <span>ATS Optimization</span>
            <span className="text-[0.7rem]">03</span>
          </div>
        </div>
        <div>
          <div className="lg:pt-14 flex flex-col gap-3 py-7 border-b border-faint-text">
            <h3 className="lg:text-[0.8rem]">
              Elevera uses AI to help you craft smarter, data-driven resumes
              that stand out instantly.
            </h3>

            <motion.div
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
              className="z-50 relative group hover:cursor-pointer bg-white/5 w-fit px-24 py-4 xs:px-20 xs:py-3 md:px-8 md:py-2 lg:px-5 lg:py-3 xl:px-3 xl:py-1 gap-16 xl:gap-4 rounded-full border border-white/10 flex items-center justify-between shadow-lg shadow-black/30 backdrop-blur-2xl overflow-hidden"
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
                Build
              </span>

              {/* Icon */}
              <motion.div className="relative -z-10 bg-secondary p-8 xm:p-7 xs:p-5 md:p-4 lg:p-2 xl:p-1 rounded-full group-hover:cursor-pointer group-hover:-rotate-45 transition-all duration-200">
                <MoveRight className="text-white w-18 h-18 xm:h-10 xm:w-10 md:h-7 md:w-7 lg:h-5 lg:w-5" />
              </motion.div>
            </motion.div>
          </div>

          <div className="pt-10 flex gap-4 text-2xl border-b pb-8 border-faint-text">
            <span>Smart Keyword Insights</span>
            <span className="text-[0.7rem]">02</span>
          </div>
          <div className="pt-10 flex gap-4 text-2xl">
            <span>Dynamic Templates</span>
            <span className="text-[0.7rem]">04</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
