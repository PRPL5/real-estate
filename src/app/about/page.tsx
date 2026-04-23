import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { getAgentProfile } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Agent",
  description: "Learn about the independent real estate agent behind the listings.",
};

export default async function AboutPage() {
  const agent = await getAgentProfile();

  return (
    <SiteShell>
      <section className="page-section py-18">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[34px] bg-[#171717] p-8 text-white">
            <p className="eyebrow text-[#c8ab90]">About The Agent</p>
            <h1 className="display-title mt-4 text-5xl">{agent?.name}</h1>
            <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[#cfb39a]">
              Independent Real Estate Agent
            </p>
          </div>
          <div className="space-y-6 rounded-[34px] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
            <p className="text-lg leading-8 text-[#5f5953]">
              {agent?.bio ??
                "A boutique approach to real estate focused on thoughtful presentation, strong communication, and a calm client experience from first tour to final signature."}
            </p>
            <p className="text-lg leading-8 text-[#5f5953]">
              This website is intentionally simple for visitors: no accounts, no portals, and no booking system. Buyers and sellers can explore listings and then contact the agent directly using the information shown across the site.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
