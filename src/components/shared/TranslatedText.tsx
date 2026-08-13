"use client";

import { useTranslation } from "@/lib/i18n";

interface TranslatedTextProps {
  path: string;
  fallback?: string;
}

export function TranslatedText({ path, fallback }: TranslatedTextProps) {
  const { t } = useTranslation();
  
  const keys = path.split(".");
  let value: unknown = t;
  
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      value = undefined;
      break;
    }
  }
  
  return <>{(value as string) || fallback || path}</>;
}
