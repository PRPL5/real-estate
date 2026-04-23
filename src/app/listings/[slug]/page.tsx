import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/listings/property-gallery";
import { SiteShell } from "@/components/layout/site-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPublicListingBySlug } from "@/lib/queries";
import { formatCurrency, normalizeWhatsapp } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  return {
    title: listing.title,
    description: listing.summary,
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const whatsappLink = normalizeWhatsapp(listing.contactWhatsapp);

  return (
    <SiteShell>
      <section className="page-section py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <PropertyGallery images={listing.images} title={listing.title} />
          <aside className="space-y-6 rounded-[30px] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
            <div className="space-y-4">
              <p className="eyebrow">{listing.propertyType}</p>
              <h1 className="display-title text-5xl leading-none text-[#171717]">{listing.title}</h1>
              <div className="flex items-center gap-3">
                <StatusBadge status={listing.listingStatus} />
                <p className="text-sm text-[#5e5851]">{listing.address}</p>
              </div>
            </div>
            <p className="text-3xl font-semibold text-[#171717]">{formatCurrency(listing.price)}</p>
            <div className="grid grid-cols-3 gap-4 rounded-[24px] bg-[#f6f1eb] p-4 text-sm text-[#4b4641]">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">Bedrooms</p>
                <p className="mt-2 font-semibold">{listing.bedrooms}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">Bathrooms</p>
                <p className="mt-2 font-semibold">{listing.bathrooms}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7f73]">Area</p>
                <p className="mt-2 font-semibold">
                  {listing.area.toLocaleString()} {listing.areaUnit}
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-7 text-[#5e5851]">
              <p>{listing.summary}</p>
              <p>{listing.description}</p>
            </div>
            <div className="space-y-3 rounded-[24px] bg-[#171717] p-5 text-sm text-white">
              <p className="font-semibold">Contact the Agent</p>
              <a href={`tel:${listing.contactPhone}`}>{listing.contactPhone}</a>
              <a href={`mailto:${listing.contactEmail}`}>{listing.contactEmail}</a>
              {whatsappLink ? (
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              ) : null}
              {listing.officeAddress ? <p>{listing.officeAddress}</p> : null}
            </div>
            <a
              href={listing.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#171717]"
            >
              Open Map
            </a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
