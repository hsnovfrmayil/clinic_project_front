"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import ProductBottle from "./ProductBottle";
import type { BottleVariant } from "@/lib/types";

export default function ProductMedia({
  src,
  alt,
  className,
  imageClassName,
  bottleClassName,
  bottle = "dropper",
  tint = "silver",
  sizes = "(max-width: 768px) 100vw, 33vw",
  fill = true,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  bottleClassName?: string;
  bottle?: BottleVariant;
  tint?: "ion" | "silver" | "gold";
  sizes?: string;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill={fill}
          sizes={sizes}
          unoptimized
          onError={() => setFailed(true)}
          className={clsx("object-contain", imageClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ProductBottle
            variant={bottle}
            tint={tint}
            className={bottleClassName ?? "h-40"}
          />
        </div>
      )}
    </div>
  );
}
