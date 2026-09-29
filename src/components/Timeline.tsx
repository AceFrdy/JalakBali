"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const moments = [
  {
    year: "1912",
    title: "Discovery",
    text: "First described to science, the species became known for its unmistakable white crown.",
  },
  {
    year: "1970s",
    title: "Population decline",
    text: "Forest loss and trapping pushed the wild population into a critical state.",
  },
  {
    year: "1990s",
    title: "Conservation efforts",
    text: "Breeding programs and reintroduction began to rebuild a fragile future.",
  },
  {
    year: "Today",
    title: "Protected habitat",
    text: "West Bali National Park remains a vital refuge for the species.",
  },
  {
    year: "Next",
    title: "A song continues",
    text: "The future depends on keeping wild places connected and protected.",
  },
] as const;

export function Timeline() {
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const maxDistanceRef = useRef(0);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTargetXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const updateBounds = useCallback(() => {
    if (!trackRef.current || !windowRef.current) return;
    const trackWidth = trackRef.current.scrollWidth;
    const windowWidth = windowRef.current.clientWidth;
    // Breathing room so the last moment is completely framed
    const extraPad = Math.max(60, window.innerWidth * 0.05);
    const maxDist = Math.max(0, trackWidth - windowWidth + extraPad);
    maxDistanceRef.current = maxDist;
    targetXRef.current = Math.max(0, Math.min(maxDist, targetXRef.current));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 800;
      setIsDesktop(desktop);
      updateBounds();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateBounds]);

  // Main animation render loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;

      const maxDist = maxDistanceRef.current;

      if (!isDraggingRef.current && maxDist > 0) {
        const diff = targetXRef.current - currentXRef.current;
        if (Math.abs(diff) < 0.2) {
          currentXRef.current = targetXRef.current;
        } else {
          currentXRef.current += diff * 0.14;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-currentXRef.current}px, 0, 0)`;
      }

      if (progressBarRef.current && maxDist > 0) {
        const progress = Math.max(0, Math.min(1, currentXRef.current / maxDist));
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      setCanScrollLeft(currentXRef.current > 10);
      setCanScrollRight(currentXRef.current < maxDist - 10);

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Pointer drag events for mouse & touch
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isDesktop || maxDistanceRef.current <= 0) return;
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDraggingState(true);
    dragStartXRef.current = e.clientX;
    dragStartTargetXRef.current = targetXRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    const dx = e.clientX - lastPointerXRef.current;

    velocityRef.current = dx / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    const totalDx = e.clientX - dragStartXRef.current;
    const maxDist = maxDistanceRef.current;

    let newX = dragStartTargetXRef.current - totalDx;
    if (newX < 0) {
      newX = newX * 0.3; // soft resistance
    } else if (newX > maxDist) {
      newX = maxDist + (newX - maxDist) * 0.3;
    }

    targetXRef.current = newX;
    currentXRef.current = newX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Momentum glide on release
    const momentum = velocityRef.current * 160;
    const maxDist = maxDistanceRef.current;
    const projectedX = targetXRef.current - momentum;
    targetXRef.current = Math.max(0, Math.min(maxDist, projectedX));
  };

  // Mouse wheel horizontal scroll support
  const onWheel = (e: React.WheelEvent) => {
    if (!isDesktop || maxDistanceRef.current <= 0) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const maxDist = maxDistanceRef.current;

    const atStart = targetXRef.current <= 0 && delta < 0;
    const atEnd = targetXRef.current >= maxDist && delta > 0;

    if (!atStart && !atEnd) {
      e.preventDefault();
      targetXRef.current = Math.max(0, Math.min(maxDist, targetXRef.current + delta * 1.15));
    }
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const step = 330;
    const maxDist = maxDistanceRef.current;
    const delta = direction === "left" ? -step : step;
    targetXRef.current = Math.max(0, Math.min(maxDist, targetXRef.current + delta));
  };

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <div className="timeline__container">
        <div className="timeline__intro">
          <div className="section-marker">
            05 <span>/</span> The long return
          </div>
          <h2 id="timeline-title">
            A future
            <br />
            in <i>motion.</i>
          </h2>
          <p>
            Conservation is not a single moment. It is a series of choices,
            carried forward.
          </p>

          <div className="timeline__controls">
            <button
              type="button"
              className="timeline__arrow"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              aria-label="Previous timeline moment"
            >
              ←
            </button>
            <button
              type="button"
              className="timeline__arrow"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              aria-label="Next timeline moment"
            >
              →
            </button>
            <span className="timeline__hint">Drag / Scroll</span>
          </div>

          <div className="timeline__progress-wrap" aria-hidden="true">
            <div className="timeline__progress-bar" ref={progressBarRef} />
          </div>
        </div>

        <div
          className={`timeline__window ${isDraggingState ? "timeline__window--dragging" : ""}`}
          ref={windowRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        >
          <div className="timeline__track" ref={trackRef}>
            {moments.map(({ year, title, text }) => (
              <article className="timeline__moment" key={year}>
                <span className="timeline__year">{year}</span>
                <i className="timeline__dot" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
