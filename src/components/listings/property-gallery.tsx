"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingImage } from "@prisma/client";
import { cn } from "@/lib/utils";

export function PropertyGallery({
  images,
  title,
}: {
  images: ListingImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[30px] bg-[#e8dfd6]">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 70vw"
          priority
        />
      </div>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl border transition",
              index === activeIndex ? "border-[#a47b5a]" : "border-transparent",
            )}
          >
            <Image
              src={image.url}
              alt={image.altText ?? `${title} image ${index + 1}`}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
