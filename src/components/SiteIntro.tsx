"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./Logo";

const LETTERS = ["E", "O", "N", "A", "G", "E"];

const LETTER_START = 0.55;
const LETTER_STEP = 0.07;
const LETTERS_END =
  LETTER_START + (LETTERS.length - 1) * LETTER_STEP + 0.5;
const EXIT_AT = Math.max(LETTERS_END + 0.7, 2.1) * 1000;
const CURTAIN_DURATION = 0.9;
const UNMOUNT_AT = EXIT_AT + CURTAIN_DURATION * 1000;

export default function SiteIntro() {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("eonage-intro-seen")) return;

    sessionStorage.setItem("eonage-intro-seen", "1");
    setShow(true);
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setExiting(true), EXIT_AT);
    const t2 = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, UNMOUNT_AT);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 border-b border-line bg-void"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 border-t border-line bg-void"
        animate={exiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.76, 0, 0.24, 1] }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(111,184,255,0.14), transparent 65%)",
        }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
        animate={exiting ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <LogoMark className="h-14 w-14 text-mist sm:h-16 sm:w-16" />
        </motion.div>

        <div className="flex text-[2.75rem] leading-none sm:text-6xl">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="font-logo font-semibold tracking-[0.08em] text-mist"
              initial={{ opacity: 0, y: 26, scale: 0.85, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.55,
                delay: LETTER_START + i * LETTER_STEP,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.span
          className="text-[11px] uppercase tracking-[0.4em] text-ion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: LETTERS_END - 0.1 }}
        >
          Science · Beauty · Technology
        </motion.span>
      </motion.div>
    </div>
  );
}
