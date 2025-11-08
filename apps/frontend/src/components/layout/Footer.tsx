import { getDateTime } from "@/lib/utils/getDateTime";
import { Button } from "../ui/Button";
import { Line } from "../ui/Line";
import { Instrument_Serif } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: "italic",
  subsets: ["latin"],
});

const FOOTER_LINKS = [
  { path: "#", name: "Privacy Policy" },
  { path: "#", name: "Terms of use" },
  { path: "#", name: "Contact" },
  { path: "#", name: "linkedIn" },
  { path: "#", name: "Github" },
];

const Footer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { year } = getDateTime();

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#footer",
            start: "top 60%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref.current]);

  return (
    <>
      <section
        id="footer"
        className="w-[98%] mx-auto p-5   -bg-linear-60 mb-20 from-20%  from-[#925322] via-40% via-[#E87F2E] to-90% to-[#925322] rounded-2xl  text-black overflow-hidden"
      >
        <div
          ref={ref}
          className="flex flex-col space-y-8 items-center w-6/12 mx-auto pt-7 pb-14"
        >
          {/* small heading */}
          <div className="flex items-center gap-2">
            <Line
              color1="gray"
              color2="#BF6B28"
              className="rotate-180 w-10"
              thickness="xs"
            />
            <span
              className={`${instrumentSerif.className} relative overflow-hidden  lg:text-[0.8rem] tracking-wider text-faint-text`}
            >
              <p className="text-black text-base">Analyze. Optimize. Succeed</p>
            </span>
            <Line
              color1="gray"
              color2="#E87F2E"
              thickness="xs"
              className="w-10"
            />
          </div>
          {/* main headline */}
          <div>
            <h1 className="text-7xl font-bold">Elevra AI</h1>
          </div>
          {/* sub-headline */}
          <div>
            <p className="text-center text-[0.8rem] w-8/12 mx-auto">
              Elevate your resume with Elevra's AI and get hired faster. Feel
              free to contact me if having any questions.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {FOOTER_LINKS.map((link, index) => (
              <div key={index}>
                <Button className="bg-transparent text-xs">{link.name}</Button>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-xs">Elevra {year}. All Rights Reserved</h1>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
