import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/queries";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireAdmin();
  const [dashboard, params] = await Promise.all([getAdminDashboardData(), searchParams]);

  return (
    <AdminShell
      title="Dashboard Overview"
      description="Track listing inventory, monitor draft versus live properties, and jump straight into the next admin task."
      currentPath="/admin/dashboard"
      notice={
        params.success === "listing-saved" ? (
          <AdminNotice type="success" message="Listing saved successfully." />
        ) : undefined
      }
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Listings" value={dashboard.stats.total} />
        <StatCard label="Available" value={dashboard.stats.available} />
        <StatCard label="Pending" value={dashboard.stats.pending} />
        <StatCard label="Sold" value={dashboard.stats.sold} />
        <StatCard label="Drafts" value={dashboard.stats.drafts} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Latest Listings</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#171717]">Newest entries</h2>
            </div>
            <Link
              href="/admin/listings"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboard.latestListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/admin/listings/${listing.id}`}
                className="flex items-center justify-between rounded-[22px] bg-[#f6f1eb] px-4 py-4 transition hover:bg-[#efe7de]"
              >
                <div>
                  <p className="font-medium text-[#171717]">{listing.title}</p>
                  <p className="mt-1 text-sm text-[#5f5953]">{listing.address}</p>
                </div>
                <span className="text-sm text-[#8d7f73]">
                  {listing.visibility === "DRAFT" ? "Draft" : listing.listingStatus.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-[#171717] p-6 text-white shadow-[0_18px_50px_rgba(18,18,18,0.12)]">
          <p className="eyebrow text-[#c8ab90]">Quick Actions</p>
          <h2 className="mt-3 text-3xl font-semibold">Keep inventory current.</h2>
          <p className="mt-4 text-sm leading-7 text-[#d9d1c9]">
            Add a new listing, review the full portfolio, or update the default contact information used across the dashboard.
          </p>
          <div className="mt-6 grid gap-3">
            <Link href="/admin/listings/new" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#171717]">
              Add New Listing
            </Link>
            <Link href="/admin/listings" className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white">
              Manage Listings
            </Link>
            <Link href="/admin/settings" className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white">
              Update Agent Settings
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Portfolio Snapshot</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#171717]">Latest portfolio entries</h2>
          </div>
          <Link
            href="/admin/listings"
            className="rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white"
          >
            Open Listings
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.listings.slice(0, 6).map((listing) => (
            <Link
              key={listing.id}
              href={`/admin/listings/${listing.id}`}
              className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(18,18,18,0.06)]"
            >
              <p className="text-xl font-semibold text-[#171717]">{listing.title}</p>
              <p className="mt-2 text-sm text-[#5f5953]">{listing.address}</p>
              <p className="mt-4 text-sm font-medium text-[#171717]">
                {listing.visibility === "DRAFT" ? "Draft" : listing.listingStatus}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-[#171717]">{value}</p>
    </div>
  );
}
