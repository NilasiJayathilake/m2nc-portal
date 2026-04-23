"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/app/(protected)/services/tokenStorage";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = tokenStorage.getUser();

    if (user?.role === "FRIEND") {
      router.replace("/friendDashboard");
      return;
    }

    if (user?.role === "NEW_COMER") {
      router.replace("/newComerDashboard");
      return;
    }

    // If we don't have a stored user yet, stay put.
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md bg-(--card) rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-(--neutral)">Loading your dashboard…</p>
      </div>
    </main>
  );
}
