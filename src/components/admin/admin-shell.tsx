import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { getAgentProfile } from "@/lib/queries";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/listings/new", label: "Add Listing" },
  { href: "/admin/settings", label: "Settings" },
];

export async function AdminShell({
  title,
  description,
  currentPath,
  notice,
  children,
}: {
  title: string;
  description: string;
  currentPath: string;
  notice?: React.ReactNode;
  children: React.ReactNode;
}) {
  const agent = await getAgentProfile();

  return (
    <div className="min-h-screen bg-[#f3efe9] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-black/5 bg-[#171717] px-5 py-6 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:px-6">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#c8ab90]">Northpoint Estates</p>
            <h2 className="mt-3 text-2xl font-semibold">{agent?.name ?? "Admin"}</h2>
            <p className="mt-2 text-sm text-[#d8d0c9]">Single-agent control panel for listings and agent settings.</p>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#171717]"
                      : "rounded-2xl px-4 py-3 text-sm text-[#ddd5ce] transition hover:bg-white/8 hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={logoutAction} className="pt-2">
            <SubmitButton className="w-full bg-[#b46c54] hover:bg-[#9e5d48]">Log Out</SubmitButton>
          </form>
        </div>
      </aside>
      <div>
        <header className="border-b border-black/5 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#8d7f73]">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#171717]">{title}</h1>
              <p className="mt-2 text-sm text-[#655d56]">{description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#171717]">{agent?.name}</p>
              <p className="text-sm text-[#6a645f]">{agent?.email}</p>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-10 sm:px-6 lg:px-8">
          {notice}
          {children}
        </div>
      </div>
    </div>
  );
}
