"use client";

import Link from "next/link";
import Image from "next/image";
import type { Listing, ListingImage } from "@prisma/client";
import { deleteListingAction, togglePublishAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

type ListingWithImages = Listing & { images: ListingImage[] };

export function AdminListingCard({ listing }: { listing: ListingWithImages }) {
  const coverImage = listing.images.find((image) => image.isCover) ?? listing.images[0];

  return (
    <article className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_50px_rgba(18,18,18,0.06)]">
      <div className="relative aspect-[16/10] bg-[#e8dfd6]">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.altText ?? listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f7f73]">{listing.propertyType}</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#171717]">{listing.title}</h3>
          </div>
          <StatusBadge status={listing.listingStatus} />
        </div>
        <div className="flex items-center justify-between text-sm text-[#635b54]">
          <span>{listing.visibility === "PUBLISHED" ? "Published" : "Draft"}</span>
          <span>Updated {formatDate(listing.updatedAt)}</span>
        </div>
        <p className="text-lg font-medium text-[#171717]">{formatCurrency(listing.price)}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/listings/${listing.id}/edit`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
          >
            Edit
          </Link>
          <form action={togglePublishAction}>
            <input type="hidden" name="listingId" value={listing.id} />
            <input
              type="hidden"
              name="visibility"
              value={listing.visibility === "PUBLISHED" ? "DRAFT" : "PUBLISHED"}
            />
            <button
              type="submit"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              {listing.visibility === "PUBLISHED" ? "Unpublish" : "Publish"}
            </button>
          </form>
          {listing.visibility === "PUBLISHED" ? (
            <Link
              href={`/listings/${listing.slug}`}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              View Live
            </Link>
          ) : null}
          <form
            action={deleteListingAction}
            onSubmit={(event) => {
              if (!window.confirm("Delete this listing permanently? This cannot be undone.")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="listingId" value={listing.id} />
            <button
              type="submit"
              className="rounded-full border border-[#b46c54]/20 bg-[#b46c54]/8 px-4 py-2 text-sm font-medium text-[#8d4f3d]"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
