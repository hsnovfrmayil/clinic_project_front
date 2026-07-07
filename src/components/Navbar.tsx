"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X } from "lucide-react";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";
import clsx from "clsx";

const LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#technology", label: "Технологии" },
  { href: "/#clinic", label: "О клинике" },
];

export default function Navbar() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-void/90 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="text-mist">
            <Logo />
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-[0.1em] text-silver transition-colors hover:text-ion"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={open}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-ion hover:text-ion"
              aria-label="Открыть корзину"
            >
              <ShoppingBag size={17} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ion text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-line bg-void px-6 py-4 md:hidden">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm uppercase tracking-[0.1em] text-silver"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
