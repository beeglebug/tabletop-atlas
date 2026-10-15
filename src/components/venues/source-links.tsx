"use client";

import { useEffect } from "react";

/** Open the disclosure before the browser scrolls to a claim’s source. */
export function SourceLinks() {
  useEffect(() => {
    function reveal() {
      if (!window.location.hash.startsWith("#source-")) return;

      const source = document.getElementById(window.location.hash.slice(1));
      const disclosure = source?.closest("details");

      if (disclosure) disclosure.open = true;

      source?.scrollIntoView({ block: "start" });

      source?.focus({ preventScroll: true });
    }

    reveal();

    window.addEventListener("hashchange", reveal);

    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  return null;
}
