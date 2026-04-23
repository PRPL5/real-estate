"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2e2a27] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
