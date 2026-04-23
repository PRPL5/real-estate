import Link from "next/link";
import Image from "next/image";
import type { Listing, ListingImage } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

type ListingWithImages = Listing & { images: ListingImage[] };

export function ListingCard({ listing }: { listing: ListingWithImages }) {
  const coverImage = listing.images.find((image) => image.isCover) ?? listing.images[0];

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(18,18,18,0.06)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe5df]">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.altText ?? listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f7f73]">
              {listing.propertyType}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#161616]">{listing.title}</h3>
          </div>
          <StatusBadge status={listing.listingStatus} />
        </div>
        <p className="text-lg font-medium text-[#222222]">{formatCurrency(listing.price)}</p>
        <p className="text-sm leading-7 text-[#5b5752]">{listing.summary}</p>
        <div className="flex items-center justify-between text-sm text-[#706960]">
          <span>{listing.bedrooms} bd</span>
          <span>{listing.bathrooms} ba</span>
          <span>
            {listing.area.toLocaleString()} {listing.areaUnit}
          </span>
        </div>
      </div>
    </Link>
  );
}
