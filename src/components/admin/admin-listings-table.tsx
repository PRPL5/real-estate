import Link from "next/link";
import type { Listing, ListingImage } from "@prisma/client";
import { togglePublishAction } from "@/app/admin/actions";
import { DeleteListingButton } from "@/components/admin/delete-listing-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

type ListingWithImages = Listing & { images: ListingImage[] };

function displayWorkflowStatus(listing: ListingWithImages) {
  return listing.visibility === "DRAFT" ? "Draft" : listing.listingStatus[0] + listing.listingStatus.slice(1).toLowerCase();
}

export function AdminListingsTable({ listings }: { listings: ListingWithImages[] }) {
  if (!listings.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-black/10 bg-white p-10 text-center">
        <p className="eyebrow">No Listings Found</p>
        <h3 className="mt-3 text-2xl font-semibold text-[#171717]">No properties match these filters.</h3>
        <p className="mt-3 text-sm text-[#5f5953]">
          Try a different status filter or create a new listing to start the portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
      <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr] gap-4 border-b border-black/5 px-6 py-4 text-xs uppercase tracking-[0.24em] text-[#8d7f73] md:grid">
        <span>Listing</span>
        <span>Status</span>
        <span>Price</span>
        <span>Updated</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-black/5">
        {listings.map((listing) => (
          <div key={listing.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr] md:items-center">
            <div>
              <p className="text-lg font-semibold text-[#171717]">{listing.title}</p>
              <p className="mt-1 text-sm text-[#5f5953]">
                {listing.address} • {listing.propertyType}
              </p>
              {listing.featured ? (
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#a47b5a]">Featured Listing</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {listing.visibility === "DRAFT" ? (
                <span className="inline-flex items-center rounded-full bg-zinc-900/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-700">
                  Draft
                </span>
              ) : (
                <StatusBadge status={listing.listingStatus} />
              )}
            </div>
            <div className="text-sm font-medium text-[#171717]">{formatCurrency(listing.price)}</div>
            <div className="text-sm text-[#5f5953]">{formatDate(listing.updatedAt)}</div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/listings/${listing.id}`}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-[#171717]"
              >
                View
              </Link>
              <Link
                href={`/admin/listings/${listing.id}/edit`}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-[#171717]"
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
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-[#171717]"
                >
                  {listing.visibility === "PUBLISHED" ? "Unpublish" : "Publish"}
                </button>
              </form>
              <DeleteListingButton listingId={listing.id} />
            </div>
            <div className="md:col-span-5 md:hidden">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">
                Workflow Status: {displayWorkflowStatus(listing)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
