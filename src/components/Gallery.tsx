import Image from "next/image";

const images = [
  ["/assets/jalak-portrait.png", "Portrait", "The white crown"],
  ["/assets/jalak-bali.webp", "Habitat", "Where the wings belong"],
  ["/assets/jalak-hero.png", "Field study", "A song in the canopy"],
  ["/assets/jalak-conservation.png", "Conservation", "A protected future"],
] as const;

export function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="gallery__heading">
        <div className="section-marker">
          07 <span>/</span> Field journal
        </div>
        <h2>
          Fragments
          <br />
          of a <i>home.</i>
        </h2>
        <p>
          Four ways of seeing a bird, a forest, and the work that holds them
          together.
        </p>
      </div>
      <div className="gallery__collage">
        {images.map(([src, label, title], index) => (
          <figure
            className={`gallery__item gallery__item--${index + 1}`}
            key={src}
          >
            <Image
              src={src}
              alt={`${label}: ${title}`}
              fill
              sizes="(max-width: 700px) 90vw, 48vw"
            />
            <figcaption>
              <span>{label}</span>
              <strong>{title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
