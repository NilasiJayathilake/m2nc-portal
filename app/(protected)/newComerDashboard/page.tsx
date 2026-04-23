"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/app/config/appRoutes";
import { logout } from "@/app/(protected)/services/auth.service";
import { tokenStorage } from "@/app/(protected)/services/tokenStorage";

export default function NewComerDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const user = tokenStorage.getUser();

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto w-full max-w-3xl bg-(--card) rounded-xl border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">New Comer Dashboard</h1>
            <p className="mt-1 text-sm text-(--neutral)">
              Signed in as {user?.email ?? "unknown"}.
            </p>
          </div>

          <button
            className="rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await logout();
                  router.replace(appRoutes.auth.login);
                } catch (err) {
                  const message =
                    err instanceof Error ? err.message : "Logout failed";
                  setError(message);
                }
              });
            }}
            disabled={isPending}
          >
            {isPending ? "Signing out…" : "Logout"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-(--tertiary)">{error}</p>
        ) : null}
      </div>
    </main>
  );
}
