import Link from "next/link";
import { AdminListingCard } from "@/components/admin/admin-listing-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAdminListings } from "@/lib/queries";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const listings = await getAdminListings();

  const publishedCount = listings.filter((listing) => listing.visibility === "PUBLISHED").length;

  return (
    <AdminShell
      title="Listing Management"
      description="Create, edit, publish, unpublish, and remove property listings from one secure dashboard."
    >
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <p className="eyebrow">Total Listings</p>
          <p className="mt-4 text-4xl font-semibold text-[#171717]">{listings.length}</p>
        </div>
        <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <p className="eyebrow">Published</p>
          <p className="mt-4 text-4xl font-semibold text-[#171717]">{publishedCount}</p>
        </div>
        <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <p className="eyebrow">Drafts</p>
          <p className="mt-4 text-4xl font-semibold text-[#171717]">{listings.length - publishedCount}</p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#171717]">All property listings</h2>
          </div>
          <Link
            href="/admin/listings/new"
            className="rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white"
          >
            Create Listing
          </Link>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          {listings.map((listing) => (
            <AdminListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
