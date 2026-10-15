"use client";

import { useMemo, useSyncExternalStore } from "react";
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

  const state = useMemo(() => parseDiscoveryState(search), [search]);

  function update(
    next: DiscoveryState | ((current: DiscoveryState) => DiscoveryState),
  ) {
    const state =
      typeof next === "function"
        ? next(parseDiscoveryState(window.location.search))
        : next;
    const url = discoveryUrl(state);

    if (url === `${window.location.pathname}${window.location.search}`) return;

    window.history.pushState(null, "", url);

    window.dispatchEvent(new Event("atlas:urlchange"));
  }

  return { state, update };
}
