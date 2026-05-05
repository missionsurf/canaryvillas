"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, LayoutGrid, ArrowLeft } from "lucide-react";

interface ImageGroup {
  label: string;
  images: string[];
}

interface Props {
  images: string[];
  villaName: string;
  imageGroups?: ImageGroup[] | null;
}

export default function PhotoGallery({ images, villaName, imageGroups }: Props) {
  const [gridOpen, setGridOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);

  const openGrid = () => setGridOpen(true);
  const closeGrid = () => setGridOpen(false);

  const openPhoto = (i: number) => {
    setGridOpen(false);
    setLightboxIndex(i);
  };
  const closePhoto = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null && !gridOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) closePhoto();
        else closeGrid();
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, gridOpen, prev, next]);

  // Track active section on scroll
  useEffect(() => {
    if (!gridOpen || !imageGroups) return;
    const container = gridScrollRef.current;
    if (!container) return;
    const handler = () => {
      const scrollTop = container.scrollTop;
      let current = 0;
      sectionRefs.current.forEach((ref, i) => {
        if (ref && ref.offsetTop - 120 <= scrollTop) current = i;
      });
      setActiveSection(current);
    };
    container.addEventListener("scroll", handler);
    return () => container.removeEventListener("scroll", handler);
  }, [gridOpen, imageGroups]);

  const scrollToSection = (i: number) => {
    const ref = sectionRefs.current[i];
    const container = gridScrollRef.current;
    if (ref && container) {
      container.scrollTo({ top: ref.offsetTop - 80, behavior: "smooth" });
    }
  };

  // Build a flat index map from grouped images back to the main images array
  const buildFlatIndex = (src: string) => images.indexOf(src);

  // Touch handling for carousel
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

  // Touch handling for lightbox
  const lbTouchX = useRef<number | null>(null);
  const lbTouchTime = useRef<number>(0);
  const handleLbTouchStart = (e: React.TouchEvent) => {
    lbTouchX.current = e.touches[0].clientX;
    lbTouchTime.current = Date.now();
  };
  const handleLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchX.current === null) return;
    const dx = lbTouchX.current - e.changedTouches[0].clientX;
    const dt = Date.now() - lbTouchTime.current;
    if (Math.abs(dx) > 30 || Math.abs(dx) / dt > 0.5) {
      if (dx > 0) next();
      else prev();
    }
    lbTouchX.current = null;
  };

  return (
    <>
      {/* ── Mobile: full-bleed swipeable carousel ── */}
      <div className="md:hidden select-none">
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: "4/3" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => openPhoto(carouselIndex)}
        >
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
                <Image src={src} alt={`${villaName} photo ${i + 1}`} fill className="object-cover" sizes="100vw" priority={i === 0} />
              </div>
            ))}
          </div>

          {carouselIndex > 0 && (
            <button onClick={(e) => { e.stopPropagation(); carouselPrev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all">
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
          )}
          {carouselIndex < images.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); carouselNext(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all">
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); openGrid(); }}
            className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All {images.length} photos
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === carouselIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: full-bleed Airbnb mosaic ── */}
      <div className="hidden md:block relative" style={{ height: "620px" }}>
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px" }}
        >
          <button onClick={() => openPhoto(0)} className="relative row-span-2 overflow-hidden group focus:outline-none">
            <Image src={images[0]} alt={`${villaName} — main photo`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="50vw" priority />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
          </button>
          {[1, 2, 3, 4].map((idx) => images[idx] && (
            <button key={idx} onClick={() => openPhoto(idx)} className="relative overflow-hidden group focus:outline-none">
              <Image src={images[idx]} alt={`${villaName} photo ${idx + 1}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" sizes="25vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </button>
          ))}
        </div>

        <button
          onClick={openGrid}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors border border-gray-200"
        >
          <LayoutGrid className="w-4 h-4" />
          Show all {images.length} photos
        </button>
      </div>

      {/* ── Photo grid / tour modal ── */}
      {gridOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Sticky header */}
          <div className="shrink-0 border-b border-gray-100 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <button onClick={closeGrid} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
                <X className="w-5 h-5" />
                Close
              </button>
              <span className="text-gray-900 font-semibold">{villaName}</span>
              <span className="text-gray-400 text-sm">{images.length} photos</span>
            </div>

            {/* Section nav tabs (only if groups exist) */}
            {imageGroups && imageGroups.length > 1 && (
              <div className="max-w-6xl mx-auto px-6 flex gap-1 pb-0 overflow-x-auto scrollbar-hide">
                {imageGroups.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(i)}
                    className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeSection === i
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {g.label}
                    <span className="ml-1.5 text-xs text-gray-400">({g.images.length})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div ref={gridScrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
              {imageGroups && imageGroups.length > 0 ? (
                imageGroups.map((group, gi) => (
                  <div
                    key={gi}
                    ref={(el) => { sectionRefs.current[gi] = el; }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{group.label}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.images.map((src, pi) => {
                        const flatIdx = buildFlatIndex(src);
                        return (
                          <button
                            key={pi}
                            onClick={() => openPhoto(flatIdx >= 0 ? flatIdx : 0)}
                            className="relative overflow-hidden rounded-2xl aspect-[4/3] group block w-full focus:outline-none"
                          >
                            <Image
                              src={src}
                              alt={`${villaName} — ${group.label} ${pi + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback: flat grid if no groups
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => openPhoto(i)}
                      className="relative overflow-hidden rounded-2xl aspect-[4/3] group block w-full focus:outline-none"
                    >
                      <Image
                        src={src}
                        alt={`${villaName} photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Single photo viewer ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onTouchStart={handleLbTouchStart}
          onTouchEnd={handleLbTouchEnd}
        >
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <button
              onClick={closePhoto}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <span className="text-white/60 text-sm tabular-nums">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button onClick={closePhoto} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-0 px-14 md:px-20">
            <button onClick={prev} className="absolute left-3 md:left-5 z-10 text-white/60 hover:text-white transition-all hover:scale-110">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="relative w-full h-full">
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
            <button onClick={next} className="absolute right-3 md:right-5 z-10 text-white/60 hover:text-white transition-all hover:scale-110">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="shrink-0 py-4 text-center">
            <p className="text-white/40 text-xs tracking-wider uppercase">{villaName}</p>
          </div>
        </div>
      )}
    </>
  );
}
