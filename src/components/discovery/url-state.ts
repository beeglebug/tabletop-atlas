"use client";

import { useSyncExternalStore } from "react";
import {
  discoveryUrl,
  parseDiscoveryState,
  type DiscoveryState,
} from "@/lib/discovery";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);

  window.addEventListener("atlas:urlchange", callback);

  return () => {
    window.removeEventListener("popstate", callback);

    window.removeEventListener("atlas:urlchange", callback);
  };
}

export function useDiscoveryState() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );

  function update(state: DiscoveryState) {
    window.history.pushState(null, "", discoveryUrl(state));

    window.dispatchEvent(new Event("atlas:urlchange"));
  }

  return { state: parseDiscoveryState(search), update };
}
