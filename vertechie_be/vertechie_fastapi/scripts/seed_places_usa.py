"""
Seed USA places (cities, towns, villages) for internal location autocomplete.
Run from project root: python -m scripts.seed_places_usa

Uses embedded list below. To add more, extend USA_PLACES or load from a JSON file.
"""

import asyncio
import json
import os
import re
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.db.session import AsyncSessionLocal, init_db
from app.models.place import Place


# Build a safe unique id: country_code|name|admin1 (no pipes in name/admin1)
def make_place_id(country_code: str, name: str, admin1: str) -> str:
    safe = lambda s: re.sub(r"[|]", "-", (s or "").strip())[:100]
    return f"{country_code}|{safe(name)}|{safe(admin1)}"


# USA: name, admin1 (state name). Comprehensive list - state capitals + cities/towns/villages.
# Source: public domain / census-style names. Extend as needed.
USA_PLACES = [
    ("New York", "New York"), ("Los Angeles", "California"), ("Chicago", "Illinois"),
    ("Houston", "Texas"), ("Phoenix", "Arizona"), ("Philadelphia", "Pennsylvania"),
    ("San Antonio", "Texas"), ("San Diego", "California"), ("Dallas", "Texas"),
    ("San Jose", "California"), ("Austin", "Texas"), ("Jacksonville", "Florida"),
    ("Fort Worth", "Texas"), ("Columbus", "Ohio"), ("Charlotte", "North Carolina"),
    ("San Francisco", "California"), ("Indianapolis", "Indiana"), ("Seattle", "Washington"),
    ("Denver", "Colorado"), ("Boston", "Massachusetts"), ("Nashville", "Tennessee"),
    ("Detroit", "Michigan"), ("Portland", "Oregon"), ("Las Vegas", "Nevada"),
    ("Memphis", "Tennessee"), ("Louisville", "Kentucky"), ("Baltimore", "Maryland"),
    ("Milwaukee", "Wisconsin"), ("Albuquerque", "New Mexico"), ("Tucson", "Arizona"),
    ("Fresno", "California"), ("Sacramento", "California"), ("Kansas City", "Missouri"),
    ("Mesa", "Arizona"), ("Atlanta", "Georgia"), ("Omaha", "Nebraska"),
    ("Colorado Springs", "Colorado"), ("Raleigh", "North Carolina"), ("Miami", "Florida"),
    ("Long Beach", "California"), ("Virginia Beach", "Virginia"), ("Oakland", "California"),
    ("Minneapolis", "Minnesota"), ("Tulsa", "Oklahoma"), ("Tampa", "Florida"),
    ("Arlington", "Texas"), ("New Orleans", "Louisiana"), ("Wichita", "Kansas"),
    ("Cleveland", "Ohio"), ("Bakersfield", "California"), ("Aurora", "Colorado"),
    ("Honolulu", "Hawaii"), ("Anaheim", "California"), ("Santa Ana", "California"),
    ("St. Louis", "Missouri"), ("Riverside", "California"), ("Corpus Christi", "Texas"),
    ("Lexington", "Kentucky"), ("Pittsburgh", "Pennsylvania"), ("Anchorage", "Alaska"),
    ("Stockton", "California"), ("Cincinnati", "Ohio"), ("St. Paul", "Minnesota"),
    ("Toledo", "Ohio"), ("Newark", "New Jersey"), ("Greensboro", "North Carolina"),
    ("Plano", "Texas"), ("Henderson", "Nevada"), ("Lincoln", "Nebraska"),
    ("Buffalo", "New York"), ("Jersey City", "New Jersey"), ("Chula Vista", "California"),
    ("Fort Wayne", "Indiana"), ("Orlando", "Florida"), ("St. Petersburg", "Florida"),
    ("Chandler", "Arizona"), ("Laredo", "Texas"), ("Norfolk", "Virginia"),
    ("Durham", "North Carolina"), ("Madison", "Wisconsin"), ("Lubbock", "Texas"),
    ("Winston-Salem", "North Carolina"), ("Garland", "Texas"), ("Glendale", "Arizona"),
    ("Hialeah", "Florida"), ("Reno", "Nevada"), ("Baton Rouge", "Louisiana"),
    ("Irvine", "California"), ("Chesapeake", "Virginia"), ("Irving", "Texas"),
    ("North Las Vegas", "Nevada"), ("Scottsdale", "Arizona"), ("Gilbert", "Arizona"),
    ("San Bernardino", "California"), ("Boise", "Idaho"), ("Birmingham", "Alabama"),
    ("Rochester", "New York"), ("Richmond", "Virginia"), ("Spokane", "Washington"),
    ("Des Moines", "Iowa"), ("Modesto", "California"), ("San Bernardino", "California"),
    ("Fremont", "California"), ("Montgomery", "Alabama"), ("Moreno Valley", "California"),
    ("Fontana", "California"), ("Columbus", "Georgia"), ("Salt Lake City", "Utah"),
    ("Fayetteville", "North Carolina"), ("Yonkers", "New York"), ("Little Rock", "Arkansas"),
    ("Augusta", "Georgia"), ("Grand Rapids", "Michigan"), ("Amarillo", "Texas"),
    ("Mobile", "Alabama"), ("Huntsville", "Alabama"), ("Grand Prairie", "Texas"),
    ("Knoxville", "Tennessee"), ("Worcester", "Massachusetts"), ("Newport News", "Virginia"),
    ("Brownsville", "Texas"), ("Santa Clarita", "California"), ("Overland Park", "Kansas"),
    ("Providence", "Rhode Island"), ("Garden Grove", "California"), ("Santa Rosa", "California"),
    ("Chattanooga", "Tennessee"), ("Oceanside", "California"), ("Fort Lauderdale", "Florida"),
    ("Rancho Cucamonga", "California"), ("Santa Clara", "California"), ("Port St. Lucie", "Florida"),
    ("Tempe", "Arizona"), ("Ontario", "California"), ("Vancouver", "Washington"),
    ("Springfield", "Missouri"), ("Cape Coral", "Florida"), ("Pembroke Pines", "Florida"),
    ("Sioux Falls", "South Dakota"), ("Peoria", "Arizona"), ("Lancaster", "California"),
    ("Elk Grove", "California"), ("Palmdale", "California"), ("Salinas", "California"),
    ("Springfield", "Massachusetts"), ("Pomona", "California"), ("Pasadena", "Texas"),
    ("Fort Collins", "Colorado"), ("Kansas City", "Kansas"), ("Rockford", "Illinois"),
    ("Joliet", "Illinois"), ("Paterson", "New Jersey"), ("Kansas City", "Kansas"),
    ("Torrance", "California"), ("Bridgeport", "Connecticut"), ("Savannah", "Georgia"),
    ("Escondido", "California"), ("Mesquite", "Texas"), ("Sunnyvale", "California"),
    ("Hollywood", "Florida"), ("Lakewood", "Colorado"), ("Pasadena", "California"),
    ("Orange", "California"), ("Naperville", "Illinois"), ("Sierra Vista", "Arizona"),
    ("Dayton", "Ohio"), ("Hayward", "California"), ("Salem", "Oregon"),
    ("Hampton", "Virginia"), ("Roseville", "California"), ("Alexandria", "Virginia"),
    ("Lake Forest", "California"), ("Springfield", "Illinois"), ("Palmdale", "California"),
    ("Rockford", "Illinois"), ("Pomona", "California"), ("Jackson", "Mississippi"),
    ("Kansas City", "Kansas"), ("Torrance", "California"), ("Savannah", "Georgia"),
    ("Bellevue", "Washington"), ("Miramar", "Florida"), ("Midland", "Texas"),
    ("Sunnyvale", "California"), ("Downey", "California"), ("El Monte", "California"),
    ("Wichita Falls", "Texas"), ("Charleston", "South Carolina"), ("Carrollton", "Texas"),
    ("Warren", "Michigan"), ("Hampton", "Virginia"), ("Huntington Beach", "California"),
    ("Cedar Rapids", "Iowa"), ("Oklahoma City", "Oklahoma"), ("Elizabeth", "New Jersey"),
    ("Corona", "California"), ("Sterling Heights", "Michigan"), ("West Valley City", "Utah"),
    ("New Haven", "Connecticut"), ("Thousand Oaks", "California"), ("McKinney", "Texas"),
    ("Concord", "California"), ("Visalia", "California"), ("West Covina", "California"),
    ("Simi Valley", "California"), ("Santa Maria", "California"), ("Evansville", "Indiana"),
    ("Round Rock", "Texas"), ("Denton", "Texas"), ("Columbia", "South Carolina"),
    ("Elgin", "Illinois"), ("Abilene", "Texas"), ("South Bend", "Indiana"),
    ("Athens", "Georgia"), ("Gainesville", "Florida"), ("Thornton", "Colorado"),
    ("Lafayette", "Louisiana"), ("Frisco", "Texas"), ("Allentown", "Pennsylvania"),
    ("Beaumont", "Texas"), ("Independence", "Missouri"), ("Surprise", "Arizona"),
    ("Springfield", "Ohio"), ("Berkeley", "California"), ("Peoria", "Illinois"),
    ("Provo", "Utah"), ("Columbia", "Missouri"), ("Lansing", "Michigan"),
    ("Norman", "Oklahoma"), ("Fargo", "North Dakota"), ("Lewisville", "Texas"),
    ("Athens", "Ohio"), ("Plano", "Texas"), ("Rochester", "Minnesota"),
    ("Ann Arbor", "Michigan"), ("Berkeley", "California"), ("Cambridge", "Massachusetts"),
    ("Wilmington", "North Carolina"), ("Arvada", "Colorado"), ("Pueblo", "Colorado"),
    ("Westminster", "Colorado"), ("Richardson", "Texas"), ("St. George", "Utah"),
    ("Billings", "Montana"), ("Manchester", "New Hampshire"), ("High Point", "North Carolina"),
    ("Murfreesboro", "Tennessee"), ("League City", "Texas"), ("Pearland", "Texas"),
    ("Edinburg", "Texas"), ("Columbia", "Maryland"), ("Odessa", "Texas"),
    ("Wilmington", "Delaware"), ("Rialto", "California"), ("San Angelo", "Texas"),
    ("Wichita Falls", "Texas"), ("Redding", "California"), ("Las Cruces", "New Mexico"),
    ("East Los Angeles", "California"), ("Carlsbad", "California"), ("Renton", "Washington"),
    ("Antioch", "California"), ("Boulder", "Colorado"), ("Green Bay", "Wisconsin"),
    ("Burbank", "California"), ("Allen", "Texas"), ("Everett", "Washington"),
    ("Centennial", "Colorado"), ("Richmond", "California"), ("Broken Arrow", "Oklahoma"),
    ("Miami Beach", "Florida"), ("Sandy Springs", "Georgia"), ("El Cajon", "California"),
    ("Jurupa Valley", "California"), ("Menifee", "California"), ("Sparks", "Nevada"),
    ("Lake Charles", "Louisiana"), ("Albany", "New York"), ("North Charleston", "South Carolina"),
    ("San Mateo", "California"), ("Vacaville", "California"), ("Orem", "Utah"),
    ("Bend", "Oregon"), ("Carmel", "Indiana"), ("Spokane Valley", "Washington"),
    ("Idaho Falls", "Idaho"), ("Bloomington", "Illinois"), ("Concord", "North Carolina"),
    ("Harrisburg", "Pennsylvania"), ("Fairfield", "California"), ("Arlington", "Virginia"),
    ("Lowell", "Massachusetts"), ("Palm Coast", "Florida"), ("Palm Bay", "Florida"),
    ("Pueblo", "Colorado"), ("San Leandro", "California"), ("Yuma", "Arizona"),
    ("Waterbury", "Connecticut"), ("Gresham", "Oregon"), ("Lewisville", "Texas"),
    ("Las Cruces", "New Mexico"), ("South Bend", "Indiana"), ("Davenport", "Iowa"),
    ("Erie", "Pennsylvania"), ("Rio Rancho", "New Mexico"), ("Sandy", "Utah"),
    ("Roanoke", "Virginia"), ("Buckeye", "Arizona"), ("Nampa", "Idaho"),
    ("Spartanburg", "South Carolina"), ("Edmond", "Oklahoma"), ("Taylor", "Michigan"),
    ("Kent", "Washington"), ("Fishers", "Indiana"), ("Fayetteville", "Arkansas"),
    ("Lee's Summit", "Missouri"), ("Rio Rancho", "New Mexico"), ("New Braunfels", "Texas"),
    ("Lawrence", "Kansas"), ("Portsmouth", "Virginia"), ("Santa Fe", "New Mexico"),
    ("San Marcos", "Texas"), ("Bethlehem", "Pennsylvania"), ("Longview", "Texas"),
    ("Bellingham", "Washington"), ("Greenville", "North Carolina"), ("West Des Moines", "Iowa"),
    ("Racine", "Wisconsin"), ("Deerfield Beach", "Florida"), ("Lawton", "Oklahoma"),
    ("North Richland Hills", "Texas"), ("Blacksburg", "Virginia"), ("Cleveland", "Tennessee"),
    ("Dover", "Delaware"), ("Albany", "Georgia"), ("Norman", "Oklahoma"),
    ("Hoover", "Alabama"), ("Bloomington", "Indiana"), ("Mission Viejo", "California"),
    ("Bismarck", "North Dakota"), ("Muncie", "Indiana"), ("Troy", "Michigan"),
    ("Jackson", "Tennessee"), ("Jefferson City", "Missouri"), ("Rapid City", "South Dakota"),
    ("Warner Robins", "Georgia"), ("Gulfport", "Mississippi"), ("Lynchburg", "Virginia"),
    ("State College", "Pennsylvania"), ("Iowa City", "Iowa"), ("Hattiesburg", "Mississippi"),
    ("Auburn", "Alabama"), ("Augusta", "Maine"), ("Charlottesville", "Virginia"),
    ("Conway", "Arkansas"), ("Morgantown", "West Virginia"), ("Mansfield", "Texas"),
    ("Pittsburg", "Kansas"), ("St. Joseph", "Missouri"), ("Jonesboro", "Arkansas"),
    ("Manhattan", "Kansas"), ("Stillwater", "Oklahoma"), ("Wilmington", "Ohio"),
    ("Sherman", "Texas"), ("Cleveland", "Mississippi"), ("Ames", "Iowa"),
    ("Meridian", "Mississippi"), ("Lawrence", "Massachusetts"), ("Grand Forks", "North Dakota"),
    ("San Luis Obispo", "California"), ("Bozeman", "Montana"), ("Missoula", "Montana"),
    ("Athens", "Ohio"), ("Decatur", "Illinois"), ("Carbondale", "Illinois"),
    ("Bloomington", "Illinois"), ("Champaign", "Illinois"), ("Urbana", "Illinois"),
    ("Springfield", "Illinois"), ("Peoria", "Illinois"), ("Rock Island", "Illinois"),
    ("Moline", "Illinois"), ("Quincy", "Illinois"), ("Galesburg", "Illinois"),
    ("Danville", "Illinois"), ("Joliet", "Illinois"), ("Naperville", "Illinois"),
    ("Aurora", "Illinois"), ("Elgin", "Illinois"), ("Waukegan", "Illinois"),
    ("Cicero", "Illinois"), ("Evanston", "Illinois"), ("Schaumburg", "Illinois"),
    ("Skokie", "Illinois"), ("Des Plaines", "Illinois"), ("Oak Lawn", "Illinois"),
    ("Berwyn", "Illinois"), ("Mount Prospect", "Illinois"), ("Wheaton", "Illinois"),
    ("Hoffman Estates", "Illinois"), ("Oak Park", "Illinois"), ("Downers Grove", "Illinois"),
    ("Elmhurst", "Illinois"), ("Glenview", "Illinois"), ("DeKalb", "Illinois"),
    ("Belleville", "Illinois"), ("Moline", "Illinois"), ("East St. Louis", "Illinois"),
    ("Alton", "Illinois"), ("Granite City", "Illinois"), ("Collinsville", "Illinois"),
    ("Edwardsville", "Illinois"), ("O'Fallon", "Illinois"), ("Belleville", "Illinois"),
    ("Springfield", "Illinois"), ("Decatur", "Illinois"), ("Bloomington", "Illinois"),
    ("Normal", "Illinois"), ("Champaign", "Illinois"), ("Urbana", "Illinois"),
    ("Danville", "Illinois"), ("Galesburg", "Illinois"), ("Quincy", "Illinois"),
    ("Peoria", "Illinois"), ("Rockford", "Illinois"), ("Freeport", "Illinois"),
    ("Sterling", "Illinois"), ("Dixon", "Illinois"), ("DeKalb", "Illinois"),
    ("Aurora", "Illinois"), ("Joliet", "Illinois"), ("Naperville", "Illinois"),
    ("Waukegan", "Illinois"), ("North Chicago", "Illinois"), ("Zion", "Illinois"),
    ("Kenosha", "Wisconsin"), ("Racine", "Wisconsin"), ("Milwaukee", "Wisconsin"),
    ("Waukesha", "Wisconsin"), ("West Allis", "Wisconsin"), ("Green Bay", "Wisconsin"),
    ("Appleton", "Wisconsin"), ("Oshkosh", "Wisconsin"), ("Fond du Lac", "Wisconsin"),
    ("Sheboygan", "Wisconsin"), ("Manitowoc", "Wisconsin"), ("Madison", "Wisconsin"),
    ("Janesville", "Wisconsin"), ("Beloit", "Wisconsin"), ("La Crosse", "Wisconsin"),
    ("Eau Claire", "Wisconsin"), ("Superior", "Wisconsin"), ("Wausau", "Wisconsin"),
    ("Stevens Point", "Wisconsin"), ("Marshfield", "Wisconsin"), ("Wisconsin Rapids", "Wisconsin"),
]

COUNTRY_DISPLAY = {"US": "United States", "IN": "India", "GB": "United Kingdom", "CA": "Canada"}


def build_display_name(name: str, admin1: str, country_code: str) -> str:
    country_name = COUNTRY_DISPLAY.get(country_code, country_code)
    parts = [p for p in [name, admin1, country_name] if p]
    return ", ".join(parts)


async def seed_usa_from_embedded():
    await init_db()
    async with AsyncSessionLocal() as session:
        count = 0
        for name, admin1 in USA_PLACES:
            place_id = make_place_id("US", name, admin1)
            display_name = build_display_name(name, admin1, "US")
            stmt = insert(Place).values(
                id=place_id,
                name=name,
                admin1=admin1,
                admin2=None,
                country_code="US",
                display_name=display_name,
            ).on_conflict_do_update(
                index_elements=["id"],
                set_={
                    "name": name,
                    "admin1": admin1,
                    "display_name": display_name,
                },
            )
            await session.execute(stmt)
            count += 1
        await session.commit()
        print(f"Seeded {count} USA places.")
        return count


async def seed_usa_from_json(json_path: Path):
    if not json_path.is_file():
        return 0
    await init_db()
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        data = data.get("places", data.get("items", []))
    async with AsyncSessionLocal() as session:
        count = 0
        for item in data:
            name = (item.get("name") or item.get("city") or "").strip()
            admin1 = (item.get("admin1") or item.get("state") or item.get("region") or "").strip()
            if not name:
                continue
            place_id = make_place_id("US", name, admin1)
            display_name = build_display_name(name, admin1, "US")
            stmt = insert(Place).values(
                id=place_id,
                name=name,
                admin1=admin1 or None,
                admin2=item.get("admin2"),
                country_code="US",
                display_name=display_name,
            ).on_conflict_do_update(
                index_elements=["id"],
                set_={
                    "name": name,
                    "admin1": admin1 or None,
                    "display_name": display_name,
                },
            )
            await session.execute(stmt)
            count += 1
        await session.commit()
        print(f"Seeded {count} USA places from {json_path}.")
        return count


async def main():
    base = Path(__file__).resolve().parent.parent
    json_path = base / "data" / "places" / "places_usa.json"
    from_json = await seed_usa_from_json(json_path)
    if from_json == 0:
        await seed_usa_from_embedded()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
