"""Extract an offline regional GeoNames index from a downloaded GB.zip.

Usage: python3 scripts/import-places.py /path/to/GB.zip
Source: https://download.geonames.org/export/dump/GB.zip (CC BY 4.0).
Only place names/coordinates are imported; no venue data is acquired.
"""

import json
import math
import sys
import zipfile
from pathlib import Path


def distance_km(latitude, longitude):
    origin_latitude, origin_longitude = 52.67659, -2.44926
    lat_delta = math.radians(latitude - origin_latitude)
    lon_delta = math.radians(longitude - origin_longitude)
    arc = math.sin(lat_delta / 2) ** 2 + math.cos(math.radians(origin_latitude)) * math.cos(math.radians(latitude)) * math.sin(lon_delta / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(arc))


with zipfile.ZipFile(sys.argv[1]) as archive:
    rows = [line.split("\t") for line in archive.read("GB.txt").decode("utf-8").splitlines()]

areas = {row[11]: row[1] for row in rows if row[7] == "ADM2"}
places = []

for row in rows:
    if row[7] not in {"PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLX"}:
        continue

    latitude, longitude = float(row[4]), float(row[5])

    if distance_km(latitude, longitude) > 60:
        continue

    places.append({
        "id": row[0],
        "name": row[1],
        "area": areas.get(row[11], "West Midlands region"),
        "latitude": latitude,
        "longitude": longitude,
        "population": int(row[14]),
    })

places.sort(key=lambda place: (-place["population"], place["name"], place["id"]))
output = Path(__file__).resolve().parents[1] / "src/content/places.json"
output.write_text(json.dumps(places, indent=2, ensure_ascii=False) + "\n")
print(f"Wrote {len(places)} regional places to {output}")
