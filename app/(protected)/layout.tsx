"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { appRoutes } from "@/app/config/appRoutes";
import { tokenStorage } from "@/app/(protected)/services/tokenStorage";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken && !refreshToken) {
      // Keep it simple: if no tokens at all, force login.
      router.replace(appRoutes.auth.login);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
