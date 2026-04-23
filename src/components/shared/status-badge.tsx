import { cn, formatListingStatus } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
        status === "AVAILABLE" && "bg-emerald-500/15 text-emerald-700",
        status === "PENDING" && "bg-amber-500/15 text-amber-700",
        status === "SOLD" && "bg-zinc-900/10 text-zinc-700",
      )}
    >
      {formatListingStatus(status)}
    </span>
  );
}
