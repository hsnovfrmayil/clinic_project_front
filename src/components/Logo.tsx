import clsx from "clsx";
import Image from "next/image";

type LogoProps = {
  className?: string;
  /** Dark logo on light backgrounds (navbar) */
  dark?: boolean;
};

export default function Logo({ className, dark = false }: LogoProps) {
  return (
    <span
      className={clsx(
        "relative block h-11 w-[108px] shrink-0 overflow-hidden sm:h-[52px] sm:w-[130px] lg:h-[60px] lg:w-[260px]",
        className
      )}
    >
      <Image
        src="/eonage-logo.png"
        alt="EONAGE"
        width={520}
        height={80}
        priority
        className={clsx(
          "absolute left-0 top-1/2 h-5 w-auto max-w-none -translate-y-1/2 origin-left scale-[1.3] sm:h-[23px] sm:scale-150 lg:h-[25px] lg:scale-[2]",
          dark ? "brightness-0 dark:invert" : "brightness-100"
        )}
      />
    </span>
  );
}
