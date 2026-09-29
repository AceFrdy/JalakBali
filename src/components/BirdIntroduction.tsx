import Image from "next/image";

export function BirdIntroduction() {
  return (
    <section className="introduction" id="story">
      <div className="section-marker">
        01 <span>/</span> An icon of Bali
      </div>
      <div className="introduction__heading">
        <p className="kicker">The first encounter</p>
        <h2>
          More than
          <br />a <i>bird.</i>
        </h2>
      </div>
      <div className="introduction__image">
        <Image
          src="/assets/jalak-portrait.png"
          alt="Portrait of a Bali Myna showing its white plumage and blue eye patch"
          fill
          sizes="(max-width: 700px) 90vw, 44vw"
        />
      </div>
      <p className="introduction__body">
        The Bali Myna is a symbol of Bali&apos;s unique biodiversity, recognized
        by its brilliant white plumage, elegant crest, and vivid blue skin
        around the eyes.
      </p>
      <p className="introduction__note">
        A small white crown
        <br />
        against a living green.
      </p>
    </section>
  );
}
