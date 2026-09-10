"use client";

import { useEffect, useRef, useCallback } from "react";
import { useShorecastStore } from "@/lib/store";
import { getSuitabilityColor, getSuitabilityLabel, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/mapConfig";
import { fetchBeachDetail } from "@/lib/api";
import type { Beach } from "@/lib/api";

interface ShorecastMapProps {
  beaches: Beach[];
}

export default function ShorecastMap({ beaches }: ShorecastMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const { setSelectedBeach } = useShorecastStore();

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const maplibregl = (await import("maplibre-gl")).default;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    map.on("load", () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: beaches.map((b) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [b.lon, b.lat] },
          properties: {
            id: b.id,
            name: b.name,
            state: b.state,
            score: b.suitability_score,
            color: getSuitabilityColor(b.suitability_score),
            label: getSuitabilityLabel(b.suitability_score),
          },
        })),
      };

      map.addSource("beaches", { type: "geojson", data: geojson });

      // Glow halo
      map.addLayer({
        id: "beach-glow",
        type: "circle",
        source: "beaches",
        paint: {
          "circle-radius": 22,
          "circle-color": ["get", "color"],
          "circle-opacity": 0.12,
          "circle-blur": 1,
        },
      });

      // Main dots
      map.addLayer({
        id: "beach-circles",
        type: "circle",
        source: "beaches",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 7, 10, 14],
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.92,
        },
      });

      // Labels
      map.addLayer({
        id: "beach-labels",
        type: "symbol",
        source: "beaches",
        layout: {
          "text-field": ["concat", ["get", "name"], "\n", ["to-string", ["get", "score"]], "/100"],
          "text-size": 11,
          "text-offset": [0, 1.6],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 2,
        },
      });

      // Click handler
      map.on("click", "beach-circles", async (e) => {
        if (!e.features?.[0]) return;
        const props = e.features[0].properties as Record<string, string | number>;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];

        new maplibregl.Popup({ closeButton: true, maxWidth: "280px" })
          .setLngLat(coords)
          .setHTML(
            `<div style="background:#0a0a0a;color:#fff;padding:10px;border-radius:6px;">
              <h3 style="font-size:14px;font-weight:700;margin-bottom:4px;">${props.name}</h3>
              <p style="font-size:11px;color:#888;margin-bottom:8px;">${props.state}</p>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="background:${props.color};color:#000;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">${props.label}</span>
                <span style="font-size:20px;font-weight:700;color:${props.color};">${props.score}/100</span>
              </div>
              <p style="font-size:10px;color:#666;margin-top:6px;">Loading live data...</p>
            </div>`
          )
          .addTo(map);

        try {
          const liveData = await fetchBeachDetail(String(props.id));
          setSelectedBeach(liveData);
        } catch (err) {
          console.error("Beach detail fetch failed", err);
        }
      });

      map.on("mouseenter", "beach-circles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "beach-circles", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }, [beaches, setSelectedBeach]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  return <div ref={mapRef} className="w-full h-full" />;
}
