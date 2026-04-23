import Link from "next/link";
import { AdminListingsTable } from "@/components/admin/admin-listings-table";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getFilteredAdminListings } from "@/lib/queries";

type Props = {
  searchParams: Promise<{ search?: string; status?: string; success?: string }>;
};

export default async function AdminListingsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const listings = await getFilteredAdminListings(search, status);

  return (
    <AdminShell
      title="Listings"
      description="Search, filter, publish, unpublish, and manage every property listing from one place."
      currentPath="/admin/listings"
      notice={
        params.success === "listing-saved" ? (
          <AdminNotice type="success" message="Listing saved successfully." />
        ) : params.success === "listing-deleted" ? (
          <AdminNotice type="success" message="Listing deleted successfully." />
        ) : undefined
      }
    >
      <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
        <form className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_auto]">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search by title or location"
            className="h-12 rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
          />
          <select
            name="status"
            defaultValue={status}
            className="h-12 rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white"
            >
              Apply
            </button>
            <Link
              href="/admin/listings"
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#171717]"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <AdminListingsTable listings={listings} />
    </AdminShell>
  );
}
