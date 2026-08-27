"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EXIT_AT = 2200;
const CURTAIN_DURATION = 0.9;
const UNMOUNT_AT = EXIT_AT + CURTAIN_DURATION * 1000;

function readShouldShowIntro() {
  if (typeof window === "undefined") return false;
  return !sessionStorage.getItem("eonage-intro-seen");
}

export default function SiteIntro() {
  const [show, setShow] = useState(readShouldShowIntro);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem("eonage-intro-seen", "1");
    document.documentElement.classList.remove("intro-active");
    document.documentElement.classList.add("intro-ready");
    document.body.style.overflow = "";
    setShow(false);
  }, []);

  useLayoutEffect(() => {
    if (!readShouldShowIntro()) {
      document.documentElement.classList.add("intro-ready");
      document.documentElement.classList.remove("intro-active");
      return;
    }

    document.documentElement.classList.add("intro-active");
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setExiting(true), EXIT_AT);
    const t2 = window.setTimeout(finish, UNMOUNT_AT);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [finish]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden={exiting}
      suppressHydrationWarning
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-void"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-void"
        animate={exiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: CURTAIN_DURATION, ease: [0.76, 0, 0.24, 1] }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(176,190,204,0.14), transparent 65%)",
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
          <Image
            src="/eonage-logo.png"
            alt="EONAGE"
            width={520}
            height={80}
            priority
            className="h-[4.5rem] w-auto brightness-0 sm:h-20"
          />
        </motion.div>

        <motion.span
          className="text-[11px] uppercase tracking-[0.4em] text-ion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Science · Beauty · Technology
        </motion.span>
      </motion.div>
    </div>
  );
}
