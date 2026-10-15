"use client";

import { useEffect, useRef, useState } from "react";
import type { Coordinates } from "@/lib/discovery";

/** Owns browser location and ignores responses after search, history or unmount. */
export function useDeviceLocation(onLocated: () => void) {
  const [origin, setOrigin] = useState<Coordinates>();
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const locationRequest = useRef(0);

  function reset() {
    locationRequest.current += 1;

    setOrigin(undefined);

    setLocating(false);

    setLocationMessage("");
  }

  // Device location is temporary; history restores the URL's geographic search.
  useEffect(() => {
    function resetLocation() {
      locationRequest.current += 1;

      setOrigin(undefined);

      setLocating(false);

      setLocationMessage("");
    }

    window.addEventListener("popstate", resetLocation);

    return () => {
      locationRequest.current += 1;

      window.removeEventListener("popstate", resetLocation);
    };
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location isn’t available in this browser. Search for a town or place instead.",
      );

      return;
    }

    const request = ++locationRequest.current;

    setLocating(true);

    setLocationMessage("Finding your location…");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (request !== locationRequest.current) return;

        onLocated();

        setOrigin({ latitude: coords.latitude, longitude: coords.longitude });

        setLocating(false);

        setLocationMessage(
          "Places sorted by distance. Your location stays in this tab and is not included in shared links.",
        );
      },
      (error) => {
        if (request !== locationRequest.current) return;

        setLocating(false);

        setLocationMessage(
          error.code === 1
            ? "Location access was denied. Search for a town or place instead."
            : "We couldn’t find your location. Search for a town or place, or try again.",
        );
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  }

  return { origin, locationMessage, locating, locate, reset };
}
