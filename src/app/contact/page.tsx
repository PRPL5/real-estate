import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { getAgentProfile } from "@/lib/queries";
import { normalizeWhatsapp } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the agent directly by phone, email, WhatsApp, or office address.",
};

export default async function ContactPage() {
  const agent = await getAgentProfile();
  const whatsappLink = normalizeWhatsapp(agent?.whatsapp);

  return (
    <SiteShell>
      <section className="page-section py-18">
        <p className="eyebrow">Contact</p>
        <h1 className="display-title mt-4 text-6xl text-[#171717]">Talk directly with the agent.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5e5851]">
          Visitors stay anonymous. Reach out by phone, email, or WhatsApp to ask about a property or schedule a conversation.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <a className="rounded-[28px] bg-white p-8 shadow-[0_18px_50px_rgba(18,18,18,0.06)]" href={`tel:${agent?.phone ?? ""}`}>
            <p className="eyebrow">Phone</p>
            <p className="mt-4 text-2xl font-semibold text-[#171717]">{agent?.phone}</p>
          </a>
          <a className="rounded-[28px] bg-white p-8 shadow-[0_18px_50px_rgba(18,18,18,0.06)]" href={`mailto:${agent?.email ?? ""}`}>
            <p className="eyebrow">Email</p>
            <p className="mt-4 text-2xl font-semibold text-[#171717]">{agent?.email}</p>
          </a>
          {whatsappLink ? (
            <a
              className="rounded-[28px] bg-white p-8 shadow-[0_18px_50px_rgba(18,18,18,0.06)]"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              <p className="eyebrow">WhatsApp</p>
              <p className="mt-4 text-2xl font-semibold text-[#171717]">Start a chat</p>
            </a>
          ) : null}
          <div className="rounded-[28px] bg-white p-8 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
            <p className="eyebrow">Office</p>
            <p className="mt-4 text-2xl font-semibold text-[#171717]">{agent?.officeAddress}</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
