import Image from "next/image";

export function Conservation() {
  return (
    <section className="conservation-scene" id="conservation">
      <Image
        className="conservation-scene__image"
        src="/assets/jalak-conservation.png"
        alt="Jalak Bali in a protected conservation environment"
        fill
        sizes="100vw"
      />
      <div className="conservation-scene__veil" />
      <div className="section-marker" data-reveal data-reveal-delay="0">
        04 <span>/</span> A species worth protecting
      </div>
      <div className="conservation-scene__copy" data-reveal data-reveal-delay="100">
        <p className="kicker">The work ahead</p>
        <h2>
          White.
          <br />
          Wild.
          <br />
          <i>Worth protecting.</i>
        </h2>
        <p>
          Once close to disappearing from the wild, the Bali Myna now depends on
          careful protection, restored habitat, and a future built patiently.
        </p>
      </div>
      <p className="conservation-scene__stamp" data-reveal data-reveal-delay="280">
        CRITICALLY
        <br />
        ENDANGERED
      </p>
    </section>
  );
}

