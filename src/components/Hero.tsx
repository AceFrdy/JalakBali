"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = ref.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let frame = 0;
    let scroll = window.scrollY;
    let targetScroll = scroll;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const onScroll = () => {
      targetScroll = window.scrollY;
    };
    const onPointer = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };
    const render = () => {
      scroll += (targetScroll - scroll) * 0.08;
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      scene.style.setProperty(
        "--hero-scroll",
        `${Math.max(0, scroll - scene.offsetTop)}px`,
      );
      scene.style.setProperty("--hero-x", `${pointerX}`);
      scene.style.setProperty("--hero-y", `${pointerY}`);
      frame = requestAnimationFrame(render);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section
      className="hero-scene"
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
    >
      <div
        className="hero-scene__layer hero-scene__layer--sky"
        aria-hidden="true"
      />
      <div
        className="hero-scene__layer hero-scene__layer--light"
        aria-hidden="true"
      />
      <div
        className="hero-scene__layer hero-scene__layer--forest"
        aria-hidden="true"
      />
      <div className="hero-scene__bird" aria-hidden="true">
        <Image
          src="/assets/Jalak Bali Biru.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 120vw, 85vw"
          className="ml-18 mt-44"
        />
      </div>
      <div className="hero-scene__grain" aria-hidden="true" />
      {/* <Navbar /> */}
      <div className="hero-scene__copy ">
        <p className="kicker">An intimate field study · Bali, Indonesia</p>
        <h1 id="hero-title">
          The last
          <br />
          <i>white</i>
          <br />
          song <span>of Bali</span>
        </h1>
        <p className="hero-scene__dek">
          Discover the beauty, habitat, and story of one of Bali&apos;s most
          iconic birds.
        </p>
        <a className="line-link" href="#story">
          Explore the story <span>↓</span>
        </a>
      </div>
      <p className="hero-scene__coordinate">
        08° 12′ S<br />
        115° 05′ E
      </p>
      <div className="scroll-cue">
        <span>Scroll to explore</span>
        <i />
      </div>
      <p className="hero-scene__vertical">
        LEUCOPSAR ROTHSCHILDI · THE BALI MYNA
      </p>
    </section>
  );
}
