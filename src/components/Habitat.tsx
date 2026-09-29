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
      <div className="section-marker">
        03 <span>/</span> Where the wings belong
      </div>
      <div className="habitat-scene__content">
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
      <p className="habitat-scene__annotation">
        West Bali National Park
        <br />
        <span>the remaining range</span>
      </p>
    </section>
  );
}
