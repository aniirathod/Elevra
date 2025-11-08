"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

interface MenuProps {
  open: boolean;
  size?: number;
  lineClass?: string;
  thickness?: number;
  lightColorClass?: string;
  darkColorClass?: string;
  onClick?: () => void;
}

const Menu = forwardRef<HTMLButtonElement, MenuProps>(
  (
    {
      open,
      size = 24,
      thickness = 2,
      lineClass = "",
      lightColorClass = "text-foreground",
      darkColorClass = "dark:text-foreground",
      onClick,
    },
    ref
  ) => {
    const lineClasses = clsx(
      "block w-full rounded-full bg-current transition-all duration-300 ease-in-out",
      lineClass
    );

    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label={open ? "Close menu" : "Open menu"}
        className={clsx(
          "relative flex flex-col justify-between items-end cursor-pointer",
          lightColorClass,
          darkColorClass
        )}
        style={{
          width: size,
          height: size * 0.75,
        }}
      >
        <motion.span
          className={lineClasses}
          style={{ height: thickness }}
          animate={open ? { width: "70%" } : { width: "100%" }}
          transition={{
            duration: 0.02,
          }}
        />
        <motion.span
          className={lineClasses}
          style={{ height: thickness }}
          animate={open ? { width: "100%" } : { width: "75%" }}
          transition={{
            duration: 0.02,
          }}
        />
        <motion.span
          className={lineClasses}
          style={{ height: thickness }}
          animate={open ? { width: "70%" } : { width: "100%" }}
          transition={{
            duration: 0.02,
          }}
        />
      </button>
    );
  }
);

Menu.displayName = "Menu";
export default Menu;
