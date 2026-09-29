"use client";

import Image from "next/image";
import { useState } from "react";

const details = [
  {
    id: "plumage",
    number: "01",
    title: "White plumage",
    text: "A luminous coat that catches the forest light.",
  },
  {
    id: "eye",
    number: "02",
    title: "Blue eye patch",
    text: "Cobalt skin frames a bright, watchful eye.",
  },
  {
    id: "crest",
    number: "03",
    title: "Long white crest",
    text: "A fine crown raised when the bird is alert.",
  },
  {
    id: "tips",
    number: "04",
    title: "Black wing tips",
    text: "Dark flight feathers draw a precise final line.",
  },
] as const;

export function Characteristics() {
  const [active, setActive] =
    useState<(typeof details)[number]["id"]>("plumage");
  const current = details.find((item) => item.id === active) ?? details[0];
  return (
    <section className="characteristics" id="characteristics">
      <div className="section-characteristics">
        02 <span>/</span> Designed by nature
      </div>
      <div className="characteristics__title">
        <p className="kicker section-characteristics">Field notes</p>
        <h2>
          Every detail
          <br />
          has a <i>purpose.</i>
        </h2>
      </div>
      <div className="bird-study">
        <Image
          src="/assets/Jalak Bali Biru.png"
          alt="Full profile of a Bali Myna"
          fill
          sizes="(max-width: 700px) 92vw, 52vw"
        />
        {details.map((detail) => (
          <button
            className={`hotspot hotspot--${detail.id} ${active === detail.id ? "hotspot--active" : ""}`}
            key={detail.id}
            type="button"
            aria-label={`Show detail: ${detail.title}`}
            onClick={() => setActive(detail.id)}
          >
            <span>{detail.number}</span>
          </button>
        ))}
        <div className="bird-study__line" />
      </div>
      <div className="characteristics__detail" aria-live="polite">
        <span>{current.number}</span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
      </div>
      <ol className="characteristics__list">
        {details.map((detail) => (
          <li
            key={detail.id}
            className={active === detail.id ? "is-active" : ""}
          >
            <button type="button" onClick={() => setActive(detail.id)}>
              <span>{detail.number}</span>
              {detail.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
