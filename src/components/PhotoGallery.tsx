"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2x2 } from "lucide-react";

interface Props {
  images: string[];
  villaName: string;
}

export default function PhotoGallery({ images, villaName }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, prev, next]);

  const gridImages = images.slice(0, 5);

  return (
    <>
      {/* Hero grid */}
      <div className="grid grid-cols-4 grid-rows-2 h-[60vh] gap-1">
        {gridImages.map((src, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className={`relative overflow-hidden group focus:outline-none ${
              i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
            }`}
          >
            <Image
              src={src}
              alt={`${villaName} photo ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {/* "+N more" overlay on the last grid cell */}
            {i === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-lg">+{images.length - 5} more</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Show all photos button */}
      <div className="flex justify-end px-4 py-2 bg-white border-b">
        <button
          onClick={() => open(0)}
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline flex items-center gap-1"
        >
          <Grid2x2 className="w-4 h-4" />
          Show all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={close}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/70 text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </span>
            <span className="text-white font-semibold">{villaName}</span>
            <button
              onClick={close}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main image */}
          <div
            className="flex-1 relative flex items-center justify-center px-16 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prev}
              className="absolute left-4 z-10 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full max-w-5xl">
              <Image
                key={lightboxIndex}
                src={images[lightboxIndex]}
                alt={`${villaName} photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              onClick={next}
              className="absolute right-4 z-10 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            className="shrink-0 px-6 py-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 justify-center">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    i === lightboxIndex
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
