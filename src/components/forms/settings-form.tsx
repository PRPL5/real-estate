"use client";

import { useActionState } from "react";
import type { AdminUser } from "@prisma/client";
import { updateSettingsAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/shared/submit-button";

type ActionState = { error?: string };

export function SettingsForm({ agent }: { agent: AdminUser }) {
  const [state, formAction] = useActionState<ActionState | void, FormData>(updateSettingsAction, {});
  const currentState = state ?? {};

  return (
    <form action={formAction} className="space-y-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(18,18,18,0.06)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Agent Name" name="name" defaultValue={agent.name} />
        <Field label="Email" name="email" type="email" defaultValue={agent.email} />
        <Field label="Phone" name="phone" defaultValue={agent.phone} />
        <Field label="WhatsApp" name="whatsapp" defaultValue={agent.whatsapp ?? ""} />
        <Field label="Office Address" name="officeAddress" defaultValue={agent.officeAddress ?? ""} className="md:col-span-2" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#171717]" htmlFor="bio">
          Professional Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={6}
          defaultValue={agent.bio ?? ""}
          className="w-full rounded-[24px] border border-black/10 bg-[#f6f1eb] px-4 py-3 outline-none transition focus:border-[#a47b5a]"
        />
      </div>
      {currentState.error ? <p className="text-sm text-red-600">{currentState.error}</p> : null}
      <div className="flex justify-end">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-[#171717]" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
      />
    </div>
  );
}
