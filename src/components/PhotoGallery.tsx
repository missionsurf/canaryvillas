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
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const carouselPrev = () => setCarouselIndex((i) => Math.max(i - 1, 0));
  const carouselNext = () => setCarouselIndex((i) => Math.min(i + 1, images.length - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dx) > 30 || Math.abs(dx) / dt > 0.5) {
      if (dx > 0) carouselNext();
      else carouselPrev();
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* ── Mobile: full-bleed swipeable carousel with dots + arrows ── */}
      <div className="md:hidden select-none">
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: "4/3" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => open(carouselIndex)}
        >
          {/* Sliding strip */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${carouselIndex * 100}%)`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              width: `${images.length * 100}%`,
            }}
          >
            {images.map((src, i) => (
              <div key={i} className="relative h-full" style={{ width: `${100 / images.length}%` }}>
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
          </div>

          {/* Left arrow */}
          {carouselIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); carouselPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
          )}

          {/* Right arrow */}
          {carouselIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); carouselNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          )}

          {/* "All photos" pill — top-right */}
          <button
            onClick={(e) => { e.stopPropagation(); open(carouselIndex); }}
            className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All {images.length} photos
          </button>

          {/* Pill dots — bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === carouselIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: full-bleed Airbnb mosaic, tall ── */}
      <div className="hidden md:block relative" style={{ height: "620px" }}>
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "4px",
          }}
        >
          {/* Hero — left column, full height */}
          <button
            onClick={() => open(0)}
            className="relative row-span-2 overflow-hidden group focus:outline-none"
          >
            <Image
              src={images[0]}
              alt={`${villaName} — main photo`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
          </button>

          {/* Top-right: images[1] and [2] */}
          {images[1] && (
            <button
              onClick={() => open(1)}
              className="relative overflow-hidden group focus:outline-none"
            >
              <Image
                src={images[1]}
                alt={`${villaName} photo 2`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </button>
          )}
          {images[2] && (
            <button
              onClick={() => open(2)}
              className="relative overflow-hidden group focus:outline-none"
            >
              <Image
                src={images[2]}
                alt={`${villaName} photo 3`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </button>
          )}

          {/* Bottom-right: images[3] and [4] */}
          {images[3] && (
            <button
              onClick={() => open(3)}
              className="relative overflow-hidden group focus:outline-none"
            >
              <Image
                src={images[3]}
                alt={`${villaName} photo 4`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </button>
          )}
          {images[4] && (
            <button
              onClick={() => open(4)}
              className="relative overflow-hidden group focus:outline-none"
            >
              <Image
                src={images[4]}
                alt={`${villaName} photo 5`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </button>
          )}
        </div>

        {/* Show all photos — bottom-right pill */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors border border-gray-200"
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
