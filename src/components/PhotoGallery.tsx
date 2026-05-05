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
    const velocity = Math.abs(dx) / dt; // px/ms
    if (Math.abs(dx) > 30 || velocity > 0.5) {
      if (dx > 0) carouselNext();
      else carouselPrev();
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* ── Mobile: sliding carousel ── */}
      <div className="md:hidden select-none">
        {/* Sliding strip */}
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: "4/3" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => open(carouselIndex)}
        >
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${carouselIndex * 100}%)`,
              transition: "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
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

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Counter top-right */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
            {carouselIndex + 1} / {images.length}
          </div>

          {/* Tap zones for prev/next — invisible, no buttons */}
          <div className="absolute inset-y-0 left-0 w-1/3" onClick={(e) => { e.stopPropagation(); carouselPrev(); }} />
          <div className="absolute inset-y-0 right-0 w-1/3" onClick={(e) => { e.stopPropagation(); carouselNext(); }} />

          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/20 pointer-events-none">
            <div
              className="h-full bg-white"
              style={{
                width: `${((carouselIndex + 1) / images.length) * 100}%`,
                transition: "width 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>

        {/* Below-image bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            {villaName}
          </span>
          <button
            onClick={() => open(carouselIndex)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All {images.length} photos
          </button>
        </div>
      </div>

      {/* ── Desktop: full-width hero + thumbnail strip ── */}
      <div className="hidden md:block relative mt-4">
        {/* Hero */}
        <button
          onClick={() => open(0)}
          className="relative w-full overflow-hidden group focus:outline-none block"
          style={{ height: "500px" }}
        >
          <Image
            src={images[0]}
            alt={`${villaName} — main photo`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
        </button>

        {/* Thumbnail strip */}
        <div className="flex gap-[3px] mt-[3px]" style={{ height: "160px" }}>
          {images.slice(1, 5).map((src, idx) => {
            const i = idx + 1;
            const isLast = idx === 3;
            return (
              <button
                key={i}
                onClick={() => open(i)}
                className="relative flex-1 overflow-hidden group focus:outline-none"
              >
                <Image
                  src={src}
                  alt={`${villaName} photo ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                {isLast && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <LayoutGrid className="w-6 h-6 text-white" />
                    <span className="text-white text-sm font-semibold">+{images.length - 5} more</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Show all photos pill */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all hover:shadow-xl border border-white/60"
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
