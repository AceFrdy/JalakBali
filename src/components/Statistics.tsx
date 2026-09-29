"use client";

import { useEffect, useRef, useState } from "react";

const metrics = [
  "Endemic to Bali",
  "Critically endangered",
  "Verified data",
  "Protected future",
];

export function Statistics() {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.35 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="statistics" ref={ref}>
      <div className="section-marker">
        06 <span>/</span> What we know
      </div>
      <div className="statistics__lead">
        <h2>
          The facts
          <br />
          ask us to <i>care.</i>
        </h2>
        <p>
          Numbers matter when they help us see what is at stake. Verified
          population figures should always come from current conservation data.
        </p>
      </div>
      <div className="statistics__list">
        {metrics.map((label, index) => (
          <div className={`stat ${shown ? "stat--shown" : ""}`} key={label}>
            <strong>{index < 2 ? "—" : "XX"}</strong>
            <span>{label}</span>
            {index > 1 && <small>Add verified conservation data</small>}
          </div>
        ))}
      </div>
    </section>
  );
}
