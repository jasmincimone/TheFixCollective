"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export type MarketplaceMapVendor = {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
};

function MapFit({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView([39.8283, -98.5795], 4);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 14 });
  }, [map, points]);

  return null;
}

const PIN_HTML =
  '<span style="display:block;width:26px;height:26px;border-radius:9999px;background:#044730;border:3px solid #fff;box-shadow:0 2px 10px rgba(52,42,15,.35)"></span>';

export function MarketplaceMap({ vendors }: { vendors: MarketplaceMapVendor[] }) {
  const pinIcon = useMemo(
    () =>
      L.divIcon({
        className: "marketplace-map-pin",
        html: PIN_HTML,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -26],
      }),
    []
  );

  const points = useMemo(
    () => vendors.map((v) => [v.latitude, v.longitude] as [number, number]),
    [vendors]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-fix-border/20 shadow-soft">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className="z-0 h-[420px] max-h-[55vh] w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFit points={points} />
        {vendors.map((v) => (
          <Marker key={v.id} position={[v.latitude, v.longitude]} icon={pinIcon}>
            <Popup>
              <Link
                href={`/marketplace/vendors/${v.id}`}
                className="block min-w-[160px] text-fix-text hover:opacity-90"
              >
                <span className="font-semibold text-fix-heading">{v.displayName}</span>
                <span className="mt-1 block text-sm font-medium text-fix-link">
                  View profile →
                </span>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
