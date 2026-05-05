"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

interface Props {
  images: string[];
  villaName: string;
}

export default function PhotoGallery({ images, villaName }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Mobile carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

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

  // Touch handlers for mobile carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCarouselIndex((i) => Math.min(i + 1, images.length - 1));
      else setCarouselIndex((i) => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* ── Mobile: full-bleed swipeable carousel ── */}
      <div className="md:hidden relative">
        <div
          className="relative w-full h-[70vw] min-h-[260px] max-h-[480px] overflow-hidden bg-gray-900"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => open(carouselIndex)}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-300 ${
                i === carouselIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={src}
                alt={`${villaName} photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Prev / Next tap areas */}
          {carouselIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCarouselIndex((i) => i - 1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {carouselIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCarouselIndex((i) => i + 1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Counter + "all photos" */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); open(0); }}
              className="bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All {images.length} photos
            </button>
          </div>

          {/* Dot indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, Math.min(images.length, 8)).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                className={`rounded-full transition-all ${
                  i === carouselIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: Airbnb-style hero grid ── */}
      <div className="hidden md:block relative overflow-hidden rounded-2xl mx-4 lg:mx-8 mt-4" style={{ height: "520px" }}>
        <div className="grid h-full gap-2" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
          {/* Large hero — spans full left column */}
          <button
            onClick={() => open(0)}
            className="relative row-span-2 overflow-hidden group focus:outline-none rounded-l-2xl"
          >
            <Image
              src={images[0]}
              alt={`${villaName} — main photo`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>

          {/* Top-right */}
          {images[1] && (
            <button
              onClick={() => open(1)}
              className="relative overflow-hidden group focus:outline-none rounded-tr-2xl"
            >
              <Image
                src={images[1]}
                alt={`${villaName} photo 2`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>
          )}

          {/* Bottom-right */}
          {images[2] && (
            <button
              onClick={() => open(2)}
              className="relative overflow-hidden group focus:outline-none rounded-br-2xl"
            >
              <Image
                src={images[2]}
                alt={`${villaName} photo 3`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {/* Show all button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>
          )}
        </div>

        {/* Show all photos button — floating bottom-right */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-colors border border-gray-200"
        >
          <LayoutGrid className="w-4 h-4" />
          Show all {images.length} photos
        </button>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          onClick={close}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              <X className="w-5 h-5" />
              Close
            </button>
            <span className="text-white/50 text-sm">
              {lightboxIndex + 1} / {images.length}
            </span>
            <span className="text-white font-semibold text-sm truncate max-w-[160px]">{villaName}</span>
          </div>

          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center relative min-h-0 px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prev}
              className="absolute left-3 md:left-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
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
              className="absolute right-3 md:right-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            className="shrink-0 py-3 overflow-x-auto border-t border-white/10 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 px-4 w-max mx-auto">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    i === lightboxIndex
                      ? "w-20 h-14 ring-2 ring-white scale-105"
                      : "w-16 h-12 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
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
