"use client";

import { useEffect, useState } from "react";

const links = [
  ["Story", "story"],
  ["Characteristics", "characteristics"],
  ["Habitat", "habitat"],
  ["Conservation", "conservation"],
  ["Gallery", "gallery"],
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
      <a className="site-nav__brand" href="#top">
        JALAK <span>BALI</span>
      </a>
      <nav className="site-nav__links" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a href={`#${href}`} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="site-nav__explore" href="#conservation">
        Explore <span>↘</span>
      </a>
      <button
        className={`menu-toggle ${open ? "menu-toggle--open" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
        <b>Menu</b>
      </button>
      <nav
        className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
        id="mobile-menu"
        aria-label="Mobile navigation"
      >
        {links.map(([label, href]) => (
          <a href={`#${href}`} key={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
