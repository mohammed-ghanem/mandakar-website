"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const DRAG_THRESHOLD = 50;

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
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(itemsPerView);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const extendedItems = [
    ...items.slice(-itemsPerView),
    ...items,
    ...items.slice(0, itemsPerView),
  ];

  const totalItems = extendedItems.length;
  const itemWidth = `${100 / itemsPerView}%`;
  const isAutoplayPaused = isHovered || isDragging;

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
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (activeIndex === totalItems - itemsPerView) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(itemsPerView);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [activeIndex, items.length, itemsPerView, totalItems]);

  const finishDrag = useCallback(() => {
    const offset = dragOffsetRef.current;

    isDraggingRef.current = false;
    setIsDragging(false);
    setIsTransitioning(true);

    requestAnimationFrame(() => {
      dragOffsetRef.current = 0;
      setDragOffset(0);

      if (offset < -DRAG_THRESHOLD) {
        goToNext();
      } else if (offset > DRAG_THRESHOLD) {
        goToPrev();
      }
    });
  }, [goToNext, goToPrev]);

  const handleDragStart = useCallback(
    (clientX: number) => {
      if (!enableDrag) return;

      isDraggingRef.current = true;
      startXRef.current = clientX;
      dragOffsetRef.current = 0;
      setIsDragging(true);
      setIsTransitioning(false);
      setDragOffset(0);
    },
    [enableDrag],
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!enableDrag || !isDraggingRef.current) return;
      const offset = clientX - startXRef.current;
      dragOffsetRef.current = offset;
      setDragOffset(offset);
    },
    [enableDrag],
  );

  const handleDragEnd = useCallback(() => {
    if (!enableDrag || !isDraggingRef.current) return;
    finishDrag();
  }, [enableDrag, finishDrag]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const baseTranslateX = `-${activeIndex * (100 / itemsPerView)}%`;
  const transform = `translateX(calc(${baseTranslateX} + ${dragOffset}px))`;

  return (
    <div
      className={`relative overflow-hidden ${maxWidth} ${className} ${
        enableDrag ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
      } select-none`}
      dir="ltr"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches[0]) handleDragStart(e.touches[0].clientX);
      }}
    >
      <Carousel className="w-full">
        <CarouselContent
          style={{
            display: "flex",
            transition: isTransitioning ? "transform 0.5s ease" : "none",
            transform,
          }}
        >
          {extendedItems.map((item, index) => (
            <CarouselItem key={index} style={{ flex: `0 0 ${itemWidth}` }}>
              <div>
                {useCardWrapper ? (
                  <Card
                    className={`p-0 relative overflow-hidden w-full`}
                  >
                    <CardContent
                      className={`${cardContentClassName} ${height}`}
                    >
                      {item}
                    </CardContent>
                  </Card>
                ) : (
                  <div className={`${cardContentClassName} ${height} p-0`}>
                    {item}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {showArrows && (
          <>
            <CarouselPrevious
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
            />
            <CarouselNext
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
            />
          </>
        )}
      </Carousel>

      {showDots && (
        <div className="flex justify-center items-center mt-5 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index + itemsPerView)}
              className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                index ===
                (activeIndex - itemsPerView + items.length) % items.length
                  ? "bkMainColor h-3 w-3 transition-all duration-300 ease-in-out "
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
