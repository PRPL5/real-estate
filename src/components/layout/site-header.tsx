import Link from "next/link";
import { siteConfig } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About Agent" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,244,240,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.32em] text-[#171717]">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[#4e4741] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#171717]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full border border-[#171717] px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-[#171717] hover:text-white"
        >
          Contact Agent
        </Link>
      </div>
    </header>
  );
}
