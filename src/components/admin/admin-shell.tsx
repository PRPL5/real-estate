import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/shared/submit-button";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3efe9]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8d7f73]">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#171717]">{title}</h1>
            <p className="mt-2 text-sm text-[#655d56]">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#171717]"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/listings/new"
              className="rounded-full bg-[#171717] px-4 py-2 text-sm font-medium text-white"
            >
              New Listing
            </Link>
            <form action={logoutAction}>
              <SubmitButton className="bg-[#b46c54] hover:bg-[#9e5d48]">Log Out</SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
