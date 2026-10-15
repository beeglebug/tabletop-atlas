# Regional place search

## Why this changed

The initial search only looked for text in a venue’s name and town. Ironbridge was visible on the map but returned nothing because no venue record had Ironbridge as its town. Search now recognises geographic places independently of venue coverage.

A recognised town/village resolves to coordinates and returns listed venues within 25 km, nearest first. The map includes the search centre and matching venue pins. Exact venue-name text search remains available. Unrecognised queries and recognised places with no nearby matching venues have different recovery text. Filters still require positively supported capabilities.

Partial names and common spelling errors produce suggestions; selecting a suggestion performs the search. Ambiguous names require selection. The `near` URL parameter preserves the selected GeoNames ID alongside `q`; the ID is checked against the query rather than accepted as an unrelated location. Search, filters and venue selection remain shareable. Device location still stays in tab memory and clears the textual query when used.

This is regional place-name search, not global address/postcode geocoding. Towns/villages/suburbs within 60 km of Telford are indexed. The result radius is 25 km from the chosen place, not from the currently visible map bounds. Map panning alone does not change the search. The curated venue dataset and its fictional labels are unchanged.

## Data source and licence

Place names/coordinates: [GeoNames GB gazetteer](https://download.geonames.org/export/dump/GB.zip), downloaded 15 October 2026. GeoNames provides its gazetteer under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/); see its [readme](https://download.geonames.org/export/dump/readme.txt). GeoNames attribution, a licence link and the extract modification notice are available in the footer’s “Data credits” disclosure, including when the map is unavailable.

The 3,514-record regional subset in `src/content/places.json` retains GeoNames IDs, place names, administrative area names, coordinates and population (used only to rank equally matching suggestions). It includes populated-place feature codes PPL, PPLA, PPLA2, PPLA3, PPLA4 and PPLX within 60 km of the GeoNames Telford centre (52.67659, -2.44926). Other features and venue information are excluded. This extract filters and restructures the source data; it does not verify venue facts.

To reproduce from a downloaded GeoNames GB.zip:

```sh
python3 scripts/import-places.py /path/to/GB.zip
npm run format
npm test
```

The extract is committed. Normal builds and visitor searches do not fetch GeoNames or send typed queries to a geocoding provider. No new API key, account, database or running search service is required.

## Verification — 15 October 2026

`npm run check`, `npm test` (7 tests), and `npm run build:worker` pass. All 26 desktop/mobile browser cases pass against the local production Workers preview (13.3 seconds in the recorded run), including Ironbridge as a town without a venue-town text match, search-centre restoration, partial/typo suggestions, filter composition and distinct unknown/no-nearby states. The 25 km scope is visible on mobile as well as desktop. These changes are local; no new remote deployment was performed.
