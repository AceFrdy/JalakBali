import Image from "next/image";

export function FinalSection() {
  return (
    <section className="final-scene">
      <Image
        src="/assets/Background.png"
        alt="Warm tropical Bali landscape at sunset"
        fill
        sizes="100vw"
      />
      <div className="final-scene__veil" />
      <div className="final-scene__bird">
        <Image
          src="/assets/Jalak Bali.png"
          alt="Jalak Bali perched in the sunset"
          fill
          sizes="35vw"
        />
      </div>
      <div className="final-scene__copy">
        <p className="kicker">The story is still being written</p>
        <h2>
          Let the song
          <br />
          <i>continue.</i>
        </h2>
        <p>
          Protecting the Jalak Bali means protecting a small but extraordinary
          part of Bali&apos;s natural heritage.
        </p>
        <div className="final-scene__links">
          <a className="line-link" href="#conservation">
            Discover conservation
            <span>↗</span>
          </a>
          <a className="line-link" href="#habitat">
            Explore the habitat <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
