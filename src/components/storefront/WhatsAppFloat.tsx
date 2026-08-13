"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const whatsappNumber = "201067258266";
  const message = encodeURIComponent("مرحباً LOVELY ORDERS، أود الاستفسار عن منتج/طلب.");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95 animate-pulse-subtle group"
    >
      <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
      <span className="absolute right-16 hidden whitespace-nowrap rounded-lg bg-onyx-800 px-3 py-1.5 text-xs text-luxury-white shadow-lg border border-gold/20 group-hover:block">
        تحدث معنا مباشرة
      </span>
    </a>
  );
}
