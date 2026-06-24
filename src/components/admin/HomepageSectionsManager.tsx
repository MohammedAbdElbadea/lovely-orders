"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleHomepageSection } from "@/app/actions/admin/settings";
import type { HomepageSection } from "@/types/domain.types";

interface HomepageSectionsManagerProps {
  sections: HomepageSection[];
}

export function HomepageSectionsManager({ sections }: HomepageSectionsManagerProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, enabled: boolean) => {
    startTransition(async () => {
      await toggleHomepageSection(id, enabled);
    });
  };

  return (
    <ul className="space-y-3">
      {sections.map((section, index) => (
        <li
          key={section.id}
          className="flex items-center gap-4 rounded-luxury border border-luxury-border/30 bg-premium-black p-4"
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              disabled={index === 0 || isPending}
              className="text-luxury-muted hover:text-gold disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={index === sections.length - 1 || isPending}
              className="text-luxury-muted hover:text-gold disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-luxury-white">
                {section.title ?? section.section_type.replace(/_/g, " ")}
              </p>
              <Badge variant="outline" className="capitalize">
                {section.section_type.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-xs text-luxury-muted">Order: {section.sort_order}</p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            loading={isPending}
            onClick={() => handleToggle(section.id, !section.is_enabled)}
          >
            {section.is_enabled ? (
              <>
                <Eye className="h-4 w-4" /> Enabled
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" /> Disabled
              </>
            )}
          </Button>
        </li>
      ))}
    </ul>
  );
}
