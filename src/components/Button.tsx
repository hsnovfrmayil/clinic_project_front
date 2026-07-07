import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 px-7 py-3.5 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-ion hover:text-ink hover:shadow-[0_0_30px_rgba(111,184,255,0.45)]",
  outline:
    "border border-line text-mist hover:border-ion hover:text-ion",
  ghost: "text-mist hover:text-ion",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  onClick,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </Link>
  );
}
