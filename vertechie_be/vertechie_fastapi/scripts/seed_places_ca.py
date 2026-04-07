"""
Seed Canada (CA) places for internal location autocomplete.
Run from project root: python -m scripts.seed_places_ca
"""

import asyncio
from pathlib import Path

from scripts.seed_places_shared import seed_from_list, seed_from_json

CA_PLACES = [
    ("Toronto", "Ontario"),
    ("Montreal", "Quebec"),
    ("Vancouver", "British Columbia"),
    ("Calgary", "Alberta"),
    ("Edmonton", "Alberta"),
    ("Ottawa", "Ontario"),
    ("Winnipeg", "Manitoba"),
    ("Quebec City", "Quebec"),
    ("Hamilton", "Ontario"),
    ("Kitchener", "Ontario"),
    ("London", "Ontario"),
    ("Victoria", "British Columbia"),
    ("Halifax", "Nova Scotia"),
    ("Saskatoon", "Saskatchewan"),
    ("Regina", "Saskatchewan"),
    ("Mississauga", "Ontario"),
    ("Windsor", "Ontario"),
    ("Oshawa", "Ontario"),
    ("St. John's", "Newfoundland and Labrador"),
    ("Charlottetown", "Prince Edward Island"),
    ("Fredericton", "New Brunswick"),
    ("Moncton", "New Brunswick"),
]


async def main():
    base = Path(__file__).resolve().parent.parent
    json_path = base / "data" / "places" / "places_ca.json"
    from_json = await seed_from_json("CA", json_path)
    if from_json > 0:
        print(f"Seeded {from_json} CA places from {json_path}.")
    else:
        n = await seed_from_list("CA", "Canada", CA_PLACES)
        print(f"Seeded {n} CA places (embedded list).")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
