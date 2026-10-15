"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  LngLatBounds,
  setWorkerUrl,
} from "maplibre-gl";
import type { SearchPlace } from "@/lib/places";
import type { PublishedVenue } from "@/content/types";
import "maplibre-gl/dist/maplibre-gl.css";

setWorkerUrl(
  new URL(
    "maplibre-gl/dist/maplibre-gl-worker.mjs",
    import.meta.url,
  ).toString(),
);

interface VenueMapProps {
  venues: readonly PublishedVenue[];
  selected: string;
  onSelect: (id: string) => void;
  onUnavailable: () => void;
  searchCentre?: SearchPlace;
}

export default function VenueMap({
  venues,
  selected,
  onSelect,
  onUnavailable,
  searchCentre,
}: VenueMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);
  const onSelectRef = useRef(onSelect);
  const pinButtons = useRef<{ id: string; button: HTMLButtonElement }[]>([]);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!container.current) return;

    let instance: Map;
    const timeout = window.setTimeout(onUnavailable, 12000);

    try {
      instance = new Map({
        container: container.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [-2.42, 52.61],
        zoom: 9.5,
        attributionControl: { compact: false },
        dragRotate: false,
      });

      map.current = instance;

      instance.touchZoomRotate.disableRotation();

      instance.addControl(
        new NavigationControl({ showCompass: false }),
        "top-right",
      );

      instance.on("load", () => {
        clearTimeout(timeout);

        setReady(true);
      });

      // A failed tile should not discard a usable map and all its markers.
      // Style failures have no source ID; the timeout covers an incomplete load.
      instance.on("error", (event) => {
        const sourceError = "sourceId" in event && event.sourceId;

        if (!sourceError && !instance.isStyleLoaded()) onUnavailable();
      });
    } catch {
      clearTimeout(timeout);

      onUnavailable();

      return;
    }

    const observer = new ResizeObserver(() => instance.resize());

    observer.observe(container.current);

    return () => {
      clearTimeout(timeout);

      observer.disconnect();

      instance.remove();

      map.current = null;
    };
  }, [onUnavailable]);

  useEffect(() => {
    const instance = map.current;

    if (!instance) return;

    const bounds = new LngLatBounds();
    const markers: Marker[] = [];

    pinButtons.current = [];

    venues.forEach((venue, index) => {
      if (venue.coordinates.status !== "known") return;

      const { latitude, longitude } = venue.coordinates.value;
      const button = document.createElement("button");

      button.type = "button";

      button.className = "map-pin";

      button.textContent = String(index + 1);

      button.setAttribute("aria-label", `Select ${venue.name}`);

      pinButtons.current.push({ id: venue.id, button });

      button.addEventListener("click", () => onSelectRef.current(venue.id));

      markers.push(
        new Marker({ element: button, anchor: "bottom-left" })
          .setLngLat([longitude, latitude])
          .addTo(instance),
      );

      bounds.extend([longitude, latitude]);
    });

    if (searchCentre) {
      const centre = document.createElement("div");

      centre.className = "search-centre";

      centre.setAttribute("role", "img");

      centre.setAttribute("aria-label", `Search centre: ${searchCentre.name}`);

      markers.push(
        new Marker({ element: centre })
          .setLngLat([searchCentre.longitude, searchCentre.latitude])
          .addTo(instance),
      );

      bounds.extend([searchCentre.longitude, searchCentre.latitude]);
    }

    if (!bounds.isEmpty())
      instance.fitBounds(bounds, { padding: 65, maxZoom: 13, duration: 0 });

    return () => markers.forEach((marker) => marker.remove());
  }, [venues, searchCentre]);

  // Keep the same DOM buttons when selection changes, preserving keyboard focus.
  useEffect(() => {
    pinButtons.current.forEach(({ id, button }) => {
      button.classList.toggle("is-selected", id === selected);

      button.setAttribute("aria-pressed", String(id === selected));
    });
  }, [selected, venues, searchCentre]);

  return (
    <>
      <div
        ref={container}
        className="map-canvas"
        role="region"
        aria-label="Venue map"
      />
      {!ready && (
        <p className="map-loading" role="status">
          Unfolding the map…
        </p>
      )}
    </>
  );
}
