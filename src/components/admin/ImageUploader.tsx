"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  bucket?: string;
  className?: string;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
  bucket = "product-images",
  className,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(value);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = maxFiles - previews.length;
      const toAdd = Array.from(files).slice(0, remaining);

      toAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setPreviews((prev) => {
            const next = [...prev, url];
            onChange?.(next);
            return next;
          });
        };
        reader.readAsDataURL(file);
      });

      // Placeholder: Supabase storage upload would go here
      // const supabase = createClient();
      // await supabase.storage.from(bucket).upload(path, file);
    },
    [maxFiles, previews.length, onChange, bucket]
  );

  const removeImage = (index: number) => {
    const next = previews.filter((_, i) => i !== index);
    setPreviews(next);
    onChange?.(next);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-luxury border-2 border-dashed p-8 transition-colors",
          dragging
            ? "border-gold bg-gold/5"
            : "border-luxury-border/40 hover:border-gold/40"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-luxury-muted" />
        <p className="mb-1 text-sm text-luxury-white">Drop images here</p>
        <p className="mb-4 text-xs text-luxury-muted">
          Supabase storage ({bucket}) — placeholder upload
        </p>
        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={previews.length >= maxFiles}
          />
          <span className="inline-flex cursor-pointer items-center justify-center rounded-luxury border border-luxury-border/40 bg-surface-elevated px-3 py-1.5 text-xs text-luxury-white hover:border-gold/50">
            Browse files
          </span>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-luxury border border-luxury-border/30 bg-surface-elevated"
            >
              {url.startsWith("data:") || url.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-luxury-muted" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-deep-black/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-luxury-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
