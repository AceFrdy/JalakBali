export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="site-footer__brand" href="#top">
          JALAK <i>BALI</i>
        </a>
        <p>An interactive exploration of Bali&apos;s iconic white songbird.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#story">About</a>
        <a href="#habitat">Habitat</a>
        <a href="#conservation">Conservation</a>
        <a href="#gallery">Gallery</a>
      </nav>
      <div className="site-footer__meta">
        <span>© 2026 Jalak Bali</span>
        <span>Made for the wild</span>
      </div>
    </footer>
  );
}
