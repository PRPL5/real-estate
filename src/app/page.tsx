import Link from "next/link";
import { ListingCard } from "@/components/listings/listing-card";
import { SiteShell } from "@/components/layout/site-shell";
import { getAgentProfile, getFeaturedListings } from "@/lib/queries";
import { normalizeWhatsapp } from "@/lib/utils";

export default async function HomePage() {
  const [agent, listings] = await Promise.all([getAgentProfile(), getFeaturedListings()]);
  const whatsappLink = normalizeWhatsapp(agent?.whatsapp);

  return (
    <SiteShell>
      <section className="hero-gradient relative overflow-hidden">
        <div className="grid-fade absolute inset-0 opacity-40" />
        <div className="page-section relative grid gap-16 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="max-w-3xl space-y-8">
            <p className="eyebrow">Independent Real Estate Agent</p>
            <div className="space-y-6">
              <h1 className="display-title max-w-4xl text-6xl leading-none text-[#171717] sm:text-7xl">
                Exceptional homes, presented with calm confidence.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#5e5851] sm:text-xl">
                A premium real estate website for one trusted advisor. Browse curated listings, learn
                about the agent, and reach out directly without accounts, portals, or friction.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/listings"
                className="rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a2624]"
              >
                Browse Listings
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[#171717] px-6 py-3 text-sm font-medium text-[#171717] transition hover:bg-[#171717] hover:text-white"
              >
                Meet the Agent
              </Link>
            </div>
          </div>
          <div className="rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.62)] p-7 shadow-[0_30px_80px_rgba(18,18,18,0.08)] backdrop-blur-xl">
            <p className="eyebrow">Direct Contact</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#171717]">{agent?.name ?? "Olivia Carter"}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#8d7f73]">
              {agent ? "Independent Real Estate Agent" : "Independent Real Estate Agent"}
            </p>
            <div className="mt-8 space-y-4 text-sm text-[#4f4842]">
              <a className="block rounded-2xl bg-white/80 px-4 py-4" href={`tel:${agent?.phone ?? ""}`}>
                {agent?.phone}
              </a>
              <a className="block rounded-2xl bg-white/80 px-4 py-4" href={`mailto:${agent?.email ?? ""}`}>
                {agent?.email}
              </a>
              {whatsappLink ? (
                <a
                  className="block rounded-2xl bg-white/80 px-4 py-4"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              ) : null}
              <div className="rounded-2xl bg-white/80 px-4 py-4">{agent?.officeAddress}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section py-18">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured Listings</p>
            <h2 className="display-title mt-3 text-5xl text-[#171717]">Selected homes on the market</h2>
          </div>
          <Link href="/listings" className="text-sm font-medium text-[#171717]">
            View all listings
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="page-section py-18">
        <div className="grid gap-8 rounded-[34px] bg-[#171717] px-7 py-10 text-white lg:grid-cols-[1.2fr_1fr] lg:px-10">
          <div>
            <p className="eyebrow text-[#c8ab90]">Why This Experience</p>
            <h2 className="display-title mt-3 text-5xl">Built for trust, not accounts and clutter.</h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-[#dfd8d2]">
            <p>Visitors stay anonymous and can move straight from browsing to conversation.</p>
            <p>The agent manages all listings privately through a secure dashboard with full CRUD controls.</p>
            <p>Each property page is optimized for presentation, readability, and search-friendly structure.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
