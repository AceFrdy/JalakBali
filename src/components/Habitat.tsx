import Image from "next/image";

export function Habitat() {
  return (
    <section className="habitat-scene" id="habitat">
      <Image
        className="habitat-scene__image"
        src="/assets/jalak-bali.webp"
        alt="Bali Myna habitat surrounded by tropical forest"
        fill
        sizes="100vw"
      />
      <div className="habitat-scene__wash" />
      <div className="section-marker" data-reveal data-reveal-delay="0">
        03 <span>/</span> Where the wings belong
      </div>
      <div className="habitat-scene__content" data-reveal data-reveal-delay="100">
        <p className="kicker">A home in the wild</p>
        <h2>
          Listen
          <br />
          to the
          <br />
          <i>forest.</i>
        </h2>
        <p>
          The last white song belongs among dry woodland, open clearings, and
          the warm, changing light of Bali.
        </p>
      </div>
      <p className="habitat-scene__annotation" data-reveal data-reveal-delay="260">
        West Bali National Park
        <br />
        <span>the remaining range</span>
      </p>
    </section>
  );
}

