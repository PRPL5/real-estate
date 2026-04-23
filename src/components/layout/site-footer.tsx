import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { normalizeWhatsapp } from "@/lib/utils";

export function SiteFooter() {
  const whatsappLink = normalizeWhatsapp(siteConfig.agent.whatsapp);

  return (
    <footer className="border-t border-black/5 bg-[#111111] text-[#f5f1eb]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-[#bda287]">{siteConfig.name}</p>
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Real estate guidance built on presentation, trust, and local market insight.
          </h2>
        </div>
        <div className="space-y-3 text-sm text-[#d0c8c0]">
          <p className="font-semibold text-white">Explore</p>
          <Link href="/listings">Listings</Link>
          <Link href="/about">About Agent</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin/login">Admin Login</Link>
        </div>
        <div className="space-y-3 text-sm text-[#d0c8c0]">
          <p className="font-semibold text-white">Contact</p>
          <a href={`tel:${siteConfig.agent.phone}`}>{siteConfig.agent.phone}</a>
          <a href={`mailto:${siteConfig.agent.email}`}>{siteConfig.agent.email}</a>
          {whatsappLink ? <a href={whatsappLink}>WhatsApp</a> : null}
          <p>{siteConfig.agent.officeAddress}</p>
        </div>
      </div>
    </footer>
  );
}
