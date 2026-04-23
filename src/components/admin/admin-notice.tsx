export function AdminNotice({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div
      className={
        type === "success"
          ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      }
    >
      {message}
    </div>
  );
}
