"use client";

import { useEffect } from "react";

/** Open the disclosure before the browser scrolls to a claim’s source. */
export function SourceLinks() {
  useEffect(() => {
    function reveal(hash: string) {
      if (!hash.startsWith("#source-")) return;

      const source = document.getElementById(hash.slice(1));
      const disclosure = source?.closest("details");

      if (disclosure) disclosure.open = true;

      source?.scrollIntoView({ block: "start" });

      source?.focus({ preventScroll: true });
    }

    function revealHash() {
      reveal(window.location.hash);
    }

    function revealClickedSource(event: MouseEvent) {
      const link =
        event.target instanceof Element
          ? event.target.closest('a[href^="#source-"]')
          : null;

      if (link) reveal(link.getAttribute("href")!);
    }

    revealHash();

    window.addEventListener("hashchange", revealHash);

    document.addEventListener("click", revealClickedSource);

    return () => {
      window.removeEventListener("hashchange", revealHash);

      document.removeEventListener("click", revealClickedSource);
    };
  }, []);

  return null;
}
