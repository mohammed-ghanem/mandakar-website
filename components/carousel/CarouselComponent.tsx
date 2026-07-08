"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

const DRAG_THRESHOLD = 40;

type CarouselComponentProps = {
  items: React.ReactNode[];
  className?: string;
  maxWidth?: string;
  height?: string;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerView?: number;
  useCardWrapper?: boolean;
  cardClassName?: string;
  cardContentClassName?: string;
  pauseOnHover?: boolean;
  enableDrag?: boolean;
};

const CarouselComponent = ({
  items,
  className = "",
  maxWidth = "w-full",
  height = "h-auto",
  autoplay = true,
  interval = 3000,
  showArrows = false,
  showDots = true,
  itemsPerView = 1,
  useCardWrapper = true,
  cardClassName = "w-full border-0 shadow-none py-2 rounded-none",
  cardContentClassName = "flex items-center justify-center p-0",
  pauseOnHover = true,
  enableDrag = true,
}: CarouselComponentProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const activeIndexRef = useRef(itemsPerView);
  const suppressClickRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(itemsPerView);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const extendedItems = [
    ...items.slice(-itemsPerView),
    ...items,
    ...items.slice(0, itemsPerView),
  ];

  const totalItems = extendedItems.length;
  const itemWidth = `${100 / itemsPerView}%`;
  const isAutoplayPaused = isHovered || isDragging;

  activeIndexRef.current = activeIndex;

  const applyTransform = useCallback(
    (offsetPx: number, index: number, withTransition: boolean) => {
      const el = trackRef.current;
      if (!el) return;

      const baseTranslateX = -(index * (100 / itemsPerView));
      el.style.transition = withTransition
        ? "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      el.style.transform = `translate3d(calc(${baseTranslateX}% + ${offsetPx}px), 0, 0)`;
    },
    [itemsPerView],
  );

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setActiveIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    intervalRef.current = setInterval(goToNext, interval);
  }, [goToNext, interval, stopAutoplay]);

  useEffect(() => {
    if (!autoplay || isAutoplayPaused) {
      stopAutoplay();
      return;
    }

    startAutoplay();
    return stopAutoplay;
  }, [autoplay, isAutoplayPaused, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (activeIndex === 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(items.length);
      }, 450);
      return () => clearTimeout(timeout);
    }
    if (activeIndex === totalItems - itemsPerView) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(itemsPerView);
      }, 450);
      return () => clearTimeout(timeout);
    }
  }, [activeIndex, items.length, itemsPerView, totalItems]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    applyTransform(0, activeIndex, isTransitioning);
  }, [activeIndex, isTransitioning, applyTransform]);

  const finishDrag = useCallback(() => {
    if (!isDraggingRef.current) return;

    const offset = dragOffsetRef.current;
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    const threshold = Math.min(DRAG_THRESHOLD, containerWidth * 0.1);

    isDraggingRef.current = false;
    pointerIdRef.current = null;
    dragOffsetRef.current = 0;
    setIsDragging(false);

    if (Math.abs(offset) > 5) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 300);
    }

    if (offset < -threshold) {
      setIsTransitioning(true);
      goToNext();
      return;
    }

    if (offset > threshold) {
      setIsTransitioning(true);
      goToPrev();
      return;
    }

    setIsTransitioning(true);
    applyTransform(0, activeIndexRef.current, true);
  }, [applyTransform, goToNext, goToPrev]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enableDrag || event.button !== 0) return;

      isDraggingRef.current = true;
      pointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      dragOffsetRef.current = 0;
      setIsDragging(true);
      setIsTransitioning(false);
      event.currentTarget.setPointerCapture(event.pointerId);
      applyTransform(0, activeIndexRef.current, false);
    },
    [applyTransform, enableDrag],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        !enableDrag ||
        !isDraggingRef.current ||
        pointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      const offset = event.clientX - startXRef.current;
      dragOffsetRef.current = offset;
      applyTransform(offset, activeIndexRef.current, false);
    },
    [applyTransform, enableDrag],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        !enableDrag ||
        !isDraggingRef.current ||
        pointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      finishDrag();
    },
    [enableDrag, finishDrag],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        !enableDrag ||
        !isDraggingRef.current ||
        pointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      finishDrag();
    },
    [enableDrag, finishDrag],
  );

  const handleClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (suppressClickRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${maxWidth} ${className} ${
        enableDrag ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
      } select-none touch-pan-y`}
      dir="ltr"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className={`flex ${isDragging ? "will-change-transform" : ""}`}
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 px-1.5 sm:px-2"
              style={{ flexBasis: itemWidth, maxWidth: itemWidth }}
            >
              {useCardWrapper ? (
                <Card className={`relative overflow-hidden p-0 ${cardClassName}`}>
                  <CardContent className={`${cardContentClassName} ${height}`}>
                    {item}
                  </CardContent>
                </Card>
              ) : (
                <div className={`${cardContentClassName} ${height} p-0`}>
                  {item}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goToNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            ›
          </button>
        </>
      )}

      {showDots && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index + itemsPerView)}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                index ===
                (activeIndex - itemsPerView + items.length) % items.length
                  ? "bkMainColor h-3 w-3 duration-300 ease-in-out"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;
