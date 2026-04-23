import type { Metadata } from "next";
import { ListingCard } from "@/components/listings/listing-card";
import { SiteShell } from "@/components/layout/site-shell";
import { getPublishedListings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Listings",
  description: "Browse available, pending, and sold listings presented by a single independent real estate agent.",
};

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <SiteShell>
      <section className="page-section py-18">
        <p className="eyebrow">Property Collection</p>
        <h1 className="display-title mt-4 max-w-3xl text-6xl text-[#171717]">Every listing, clearly presented.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5e5851]">
          Explore published listings with clean details, status labels, image-rich presentation, and direct contact information for the agent.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
