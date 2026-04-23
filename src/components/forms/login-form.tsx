"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/shared/submit-button";

type ActionState = {
  error?: string;
};

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_24px_60px_rgba(18,18,18,0.08)]">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#171717]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue="agent@northpoint.com"
          className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#171717]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue="ChangeMe123!"
          className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6f1eb] px-4 outline-none transition focus:border-[#a47b5a]"
          required
        />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton className="w-full">Sign In</SubmitButton>
    </form>
  );
}
