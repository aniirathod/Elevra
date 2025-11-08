"use client";

import React, { useEffect, useRef, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

interface ScrollRevealProps {
  children: ReactNode;
  trigger?: string;
  dullColor?: string;
  brightColor?: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  start?: string;
  end?: string;
  stagger?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  dullColor = "#777",
  brightColor = "#ffffff",
  containerClassName = "",
  textClassName = "",
  start = "top 80%",
  end = "top 30%",
  stagger = 0.1,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text into characters
    const split = new SplitText(containerRef.current.querySelector("p"), {
      type: "chars , words",
    });

    // Animate each character’s color on scroll
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.words,
        { color: dullColor },
        {
          color: brightColor,
          stagger,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            end,
            scrub: true,
            markers: false,
            scroller: scrollContainerRef?.current || window,
          },
        }
      );
    });

    // Cleanup on unmount
    return () => {
      ctx.revert();
      split.revert();
    };
  }, [scrollContainerRef, start, end, stagger]);

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <p className={`text-xl leading-[1.5] font-semibold ${textClassName}`}>
        {children}
      </p>
    </h2>
  );
};

export default ScrollReveal;
