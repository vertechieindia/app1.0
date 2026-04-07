"""
Seed United Kingdom (GB) places for internal location autocomplete.
Run from project root: python -m scripts.seed_places_gb
"""

import asyncio
from pathlib import Path

from scripts.seed_places_shared import seed_from_list, seed_from_json

GB_PLACES = [
    ("London", "England"),
    ("Birmingham", "England"),
    ("Manchester", "England"),
    ("Leeds", "England"),
    ("Glasgow", "Scotland"),
    ("Liverpool", "England"),
    ("Edinburgh", "Scotland"),
    ("Bristol", "England"),
    ("Cardiff", "Wales"),
    ("Belfast", "Northern Ireland"),
    ("Sheffield", "England"),
    ("Leicester", "England"),
    ("Coventry", "England"),
    ("Bradford", "England"),
    ("Nottingham", "England"),
    ("Newcastle upon Tyne", "England"),
    ("Brighton", "England"),
    ("Reading", "England"),
    ("Cambridge", "England"),
    ("Oxford", "England"),
    ("Southampton", "England"),
    ("Portsmouth", "England"),
    ("Norwich", "England"),
    ("Swansea", "Wales"),
    ("Aberdeen", "Scotland"),
]


async def main():
    base = Path(__file__).resolve().parent.parent
    json_path = base / "data" / "places" / "places_gb.json"
    from_json = await seed_from_json("GB", json_path)
    if from_json > 0:
        print(f"Seeded {from_json} GB places from {json_path}.")
    else:
        n = await seed_from_list("GB", "United Kingdom", GB_PLACES)
        print(f"Seeded {n} GB places (embedded list).")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
