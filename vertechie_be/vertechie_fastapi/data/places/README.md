# Internal location autocomplete – places data

Places are seeded **per country**. The API already supports **US, IN, GB, CA**. No frontend change is needed when you add a new country; just run that country’s seed.

## How to integrate a country

### 1. Run the seed script for that country

From `vertechie_be/vertechie_fastapi`:

```bash
# USA (already done)
python -m scripts.seed_places_usa

# India
python -m scripts.seed_places_india

# UK and Canada: use the same pattern (see below).
```

### 2. Optional: use a JSON file for more places

You can put a JSON file in this folder and the script will load it (and skip or extend the embedded list, depending on the script).

- **USA:** `places_usa.json`
- **India:** `places_india.json`
- **UK:** `places_uk.json`
- **Canada:** `places_canada.json`

Format (array of objects):

```json
[
  { "name": "Mumbai", "admin1": "Maharashtra" },
  { "name": "London", "admin1": "England" }
]
```

Allowed keys: `name` or `city`; `admin1` or `state` or `region`; optional `admin2`.

### 3. Add UK (GB) or Canada (CA)

**Option A – New script (recommended)**

Copy `scripts/seed_places_india.py` to:

- `scripts/seed_places_uk.py` for UK (use `country_code="GB"`, country name “United Kingdom” is in the shared helper).
- `scripts/seed_places_canada.py` for Canada (use `country_code="CA"`).

Replace the embedded list with (name, admin1) tuples, e.g.:

**UK (GB):**  
`("London", "England"), ("Manchester", "England"), ("Birmingham", "England"), ("Leeds", "England"), ("Glasgow", "Scotland"), ("Edinburgh", "Scotland"), ("Cardiff", "Wales"), ("Belfast", "Northern Ireland"), ...`

**Canada (CA):**  
`("Toronto", "Ontario"), ("Montreal", "Quebec"), ("Vancouver", "British Columbia"), ("Calgary", "Alberta"), ("Edmonton", "Alberta"), ("Ottawa", "Ontario"), ...`

In each script’s `main()`, call:

- UK: `seed_from_json("GB", base / "data" / "places" / "places_uk.json")` and if 0, `seed_from_list("GB", "United Kingdom", UK_PLACES)`.
- Canada: same with `"CA"`, `"Canada"`, and `places_canada.json` / `CANADA_PLACES`.

**Option B – One-off from JSON only**

Create only the JSON file (e.g. `places_uk.json`, `places_canada.json`) and a tiny script that calls `seed_from_json("GB", path)` or `seed_from_json("CA", path)`. No embedded list needed.

### 4. Frontend

The work-location autocomplete already sends the signup **location** as the `country` query param:

- Signup location **US** → API `country=US`
- Signup location **IN** → API `country=IN`
- Signup location **UK** → API `country=GB`
- Signup location **CA** → API `country=CA`

So once a country is seeded, autocomplete for that country works with no frontend change.

## Summary

| Country | API code | Seed script           | Optional JSON          |
|---------|----------|------------------------|------------------------|
| USA     | US       | seed_places_usa        | places_usa.json        |
| India   | IN       | seed_places_india      | places_india.json      |
| UK      | GB       | add seed_places_uk     | places_uk.json         |
| Canada  | CA       | add seed_places_canada | places_canada.json     |

Run one country at a time; the same `places` table and `GET /places/autocomplete` API are used for all.
