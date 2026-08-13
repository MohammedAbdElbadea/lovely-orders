"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefreshOnFocus() {
  const router = useRouter();

  useEffect(() => {
    const handleFocus = () => {
      // Automatically refresh the current route data whenever the user switches back to this open tab
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  return null;
}
