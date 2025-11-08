"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Menu from "../ui/Menu";
import { Button } from "../ui/Button";
import { useLenis } from "lenis/react";

const MENU_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const dropdownVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.25,
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -15 },
  open: { opacity: 1, x: 0 },
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<number>(24);
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      !menuRef.current?.contains(e.target as Node) &&
      !dropdownRef.current?.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  const updateMenuIconSize = useCallback(() => {
    const width = window.innerWidth;

    if (width > 480) {
      setSize(20);
    } else {
      setSize(14);
    }
  }, []);

  useEffect(() => {
    updateMenuIconSize(); // run once at mount
    window.addEventListener("resize", updateMenuIconSize);

    return () => window.removeEventListener("resize", updateMenuIconSize);
  }, [updateMenuIconSize]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  // scrolling

  const lenis = useLenis();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const href = e.currentTarget.getAttribute("href");
    if (!href || !lenis) return;

    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      lenis.scrollTo(el, {
        offset: 0,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      });
      setOpen(false); // close the menu after clicking
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full py-24 xs:py-18 sm:py-14 lg:py-7 text-white z-50">
      <div className="max-w-screen-2xl mx-auto w-11/12 flex justify-between items-center">
        <Link
          href="/"
          className=" text-8xl xm:text-7xl l:text-5xl sm:text-4xl lg:text-2xl xl:text-xl font-bold hover:text-gray-300 transition-colors"
        >
          Elevra
        </Link>

        <div className="relative bg-surface xm:p-10 l:p-6 sm:p-4 md:p-3 rounded-full">
          <Menu open={open} onClick={toggleMenu} ref={menuRef} size={size} />

          <motion.div
            ref={dropdownRef}
            className="absolute top-12 right-7 bg-primary rounded-lg shadow-lg w-60 py-4 flex flex-col overflow-hidden"
            variants={dropdownVariants}
            initial={false}
            animate={open ? "open" : "closed"}
          >
            {MENU_ITEMS.map(({ label, href }, index) => (
              <motion.div
                key={href}
                variants={itemVariants}
                className={`text-sm font-medium hover:text-white/80 transition-colors `}
              >
                <Button>
                  <Link href={href} onClick={handleScroll}>
                    {label}
                  </Link>
                </Button>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              className="px-2 pt-6 flex gap-3"
            >
              {["Login", "Sign Up"].map((action, index) => (
                <Button asChild className="hover:text-secondary" key={index}>
                  <Link href={action}>{action}</Link>
                </Button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
