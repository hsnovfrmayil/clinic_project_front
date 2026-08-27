"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  NavbarSearchButton,
  NavbarSearchPanel,
} from "./NavbarSearch";
import clsx from "clsx";

const LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/brands", label: "Бренды" },
  { href: "/#technology", label: "Технологии" },
  { href: "/#clinic", label: "О клинике" },
];

const BOOKING_OPTIONS = [
  {
    label: "Наличие акне",
    href: "https://t.me/eonage_acne",
  },
  {
    label: "Подбор уход",
    href: "https://t.me/eonage_care",
  },
] as const;

function BookingDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[13px] uppercase tracking-[0.1em] text-silver transition-colors hover:text-ion"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Запись
        <ChevronDown
          size={14}
          className={clsx("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-3 min-w-[220px] overflow-hidden rounded-xl border border-line bg-panel py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          {BOOKING_OPTIONS.map((option) => (
            <a
              key={option.label}
              role="menuitem"
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2.5 text-sm text-silver transition-colors hover:bg-panel-2 hover:text-ion"
            >
              {option.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { count, cartPulse } = useCart();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    if (!cartPulse) return;
    setBadgeBump(true);
    const timer = window.setTimeout(() => setBadgeBump(false), 450);
    return () => window.clearTimeout(timer);
  }, [cartPulse]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-search-area]")) return;
      setSearchOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [searchOpen]);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled || searchOpen
            ? "bg-void/90 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent",
          "relative"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="text-mist">
            <Logo dark />
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
            <BookingDropdown />
          </div>

          <div className="flex items-center gap-3">
            <NavbarSearchButton
              open={searchOpen}
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
            />
            <ThemeToggle />
            <Link
              href="/auth"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-ion hover:text-ion"
              aria-label={isAuthenticated ? "Аккаунт" : "Войти в аккаунт"}
            >
              <User size={17} />
            </Link>
            <Link
              href="/cart"
              className={clsx(
                "relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-all duration-300 hover:border-ion hover:text-ion",
                badgeBump && "border-ion text-ion scale-110"
              )}
              aria-label="Открыть корзину"
            >
              <ShoppingBag size={17} />
              {count > 0 && (
                <span
                  className={clsx(
                    "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ion text-[10px] font-bold text-ink transition-transform duration-300",
                    badgeBump && "scale-125"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist md:hidden"
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              aria-label="Меню"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        <NavbarSearchPanel
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />

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
            <div className="mt-2 border-t border-line pt-3">
              <p className="py-1 text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                Запись
              </p>
              {BOOKING_OPTIONS.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-sm text-silver transition-colors hover:text-ion"
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
