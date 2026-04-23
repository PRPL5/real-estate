import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteListingButton } from "@/components/admin/delete-listing-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { requireAdmin } from "@/lib/auth";
import { getAdminListingById } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminListingDetailPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const listing = await getAdminListingById(id);

  if (!listing) notFound();

  return (
    <AdminShell
      title={listing.title}
      description="Full admin view of the property, including status, contact information, and image ordering."
      currentPath="/admin/listings"
      notice={
        query.success === "listing-saved" ? (
          <AdminNotice type="success" message="Listing updated successfully." />
        ) : undefined
      }
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{listing.propertyType}</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#171717]">{listing.title}</h2>
            </div>
            {listing.visibility === "DRAFT" ? (
              <span className="inline-flex items-center rounded-full bg-zinc-900/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-700">
                Draft
              </span>
            ) : (
              <StatusBadge status={listing.listingStatus} />
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {listing.images.length ? (
              listing.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-[24px] border border-black/5 bg-[#fbf7f3] p-3">
                  <div
                    className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.url})` }}
                  />
                  <p className="mt-3 text-sm text-[#5f5953]">
                    {image.isCover ? "Cover Image" : `Order ${image.position + 1}`}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 p-8 text-sm text-[#5f5953]">
                No images uploaded for this listing yet.
              </div>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Info label="Price" value={formatCurrency(listing.price)} />
            <Info label="Location" value={listing.address} />
            <Info label="Bedrooms" value={String(listing.bedrooms)} />
            <Info label="Bathrooms" value={String(listing.bathrooms)} />
            <Info label="Area" value={`${listing.area.toLocaleString()} ${listing.areaUnit}`} />
            <Info label="Featured" value={listing.featured ? "Yes" : "No"} />
            <Info label="Created" value={formatDate(listing.createdAt)} />
            <Info label="Updated" value={formatDate(listing.updatedAt)} />
          </div>
          <div>
            <p className="eyebrow">Short Summary</p>
            <p className="mt-3 text-sm leading-7 text-[#5f5953]">{listing.summary}</p>
          </div>
          <div>
            <p className="eyebrow">Description</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5f5953]">{listing.description}</p>
          </div>
        </div>

        <aside className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <div>
            <p className="eyebrow">Contact Details</p>
            <div className="mt-4 space-y-3 text-sm text-[#5f5953]">
              <p>{listing.contactName}</p>
              <p>{listing.contactPhone}</p>
              <p>{listing.contactEmail}</p>
              {listing.contactWhatsapp ? <p>{listing.contactWhatsapp}</p> : null}
            </div>
          </div>
          <div>
            <p className="eyebrow">Links</p>
            <a
              href={listing.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              Open Google Maps
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/listings/${listing.id}/edit`}
              className="rounded-full bg-[#171717] px-4 py-2 text-sm font-medium text-white"
            >
              Edit Listing
            </Link>
            <DeleteListingButton listingId={listing.id} />
          </div>
        </aside>
      </section>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#f6f1eb] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#171717]">{value}</p>
    </div>
  );
}
