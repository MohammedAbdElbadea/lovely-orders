"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocaleStore, type Locale } from "@/stores/locale-store";
import { ar } from "./dictionaries/ar";
import { en } from "./dictionaries/en";
import type { Dictionary } from "./types";

const dictionaries = { ar, en };

const TranslationContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "rtl" | "ltr";
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set document direction
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  // Before hydration, use the default locale ('ar') to avoid hydration mismatch and crash
  const activeLocale = mounted ? locale : "ar";

  const value = {
    locale: activeLocale,
    setLocale,
    t: dictionaries[activeLocale],
    dir: (activeLocale === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LocaleProvider");
  }
  return context;
}
