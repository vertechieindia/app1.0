"""
Seed India places (cities, towns, villages) for internal location autocomplete.
Run from project root: python -m scripts.seed_places_india

Uses embedded list below. To add more, extend INDIA_PLACES or add data/places/places_india.json.
"""

import asyncio
from pathlib import Path

from scripts.seed_places_shared import seed_from_list, seed_from_json

# India: (name, state_or_union_territory). State capitals + major cities + towns.
INDIA_PLACES = [
    ("Mumbai", "Maharashtra"), ("Delhi", "Delhi"), ("Bangalore", "Karnataka"),
    ("Hyderabad", "Telangana"), ("Chennai", "Tamil Nadu"), ("Kolkata", "West Bengal"),
    ("Pune", "Maharashtra"), ("Ahmedabad", "Gujarat"), ("Surat", "Gujarat"),
    ("Jaipur", "Rajasthan"), ("Lucknow", "Uttar Pradesh"), ("Kanpur", "Uttar Pradesh"),
    ("Nagpur", "Maharashtra"), ("Indore", "Madhya Pradesh"), ("Thane", "Maharashtra"),
    ("Bhopal", "Madhya Pradesh"), ("Visakhapatnam", "Andhra Pradesh"), ("Pimpri-Chinchwad", "Maharashtra"),
    ("Patna", "Bihar"), ("Vadodara", "Gujarat"), ("Ghaziabad", "Uttar Pradesh"),
    ("Ludhiana", "Punjab"), ("Agra", "Uttar Pradesh"), ("Nashik", "Maharashtra"),
    ("Faridabad", "Haryana"), ("Meerut", "Uttar Pradesh"), ("Rajkot", "Gujarat"),
    ("Varanasi", "Uttar Pradesh"), ("Amritsar", "Punjab"), ("Allahabad", "Uttar Pradesh"),
    ("Ranchi", "Jharkhand"), ("Howrah", "West Bengal"), ("Coimbatore", "Tamil Nadu"),
    ("Jabalpur", "Madhya Pradesh"), ("Gwalior", "Madhya Pradesh"), ("Vijayawada", "Andhra Pradesh"),
    ("Jodhpur", "Rajasthan"), ("Madurai", "Tamil Nadu"), ("Raipur", "Chhattisgarh"),
    ("Kota", "Rajasthan"), ("Guwahati", "Assam"), ("Chandigarh", "Chandigarh"),
    ("Solapur", "Maharashtra"), ("Hubli-Dharwad", "Karnataka"), ("Tiruchirappalli", "Tamil Nadu"),
    ("Bareilly", "Uttar Pradesh"), ("Mysore", "Karnataka"), ("Tiruppur", "Tamil Nadu"),
    ("Gurgaon", "Haryana"), ("Aligarh", "Uttar Pradesh"), ("Jalandhar", "Punjab"),
    ("Bhubaneswar", "Odisha"), ("Salem", "Tamil Nadu"), ("Warangal", "Telangana"),
    ("Mira-Bhayandar", "Maharashtra"), ("Thiruvananthapuram", "Kerala"), ("Bhiwandi", "Maharashtra"),
    ("Saharanpur", "Uttar Pradesh"), ("Mumbai", "Maharashtra"), ("Guntur", "Andhra Pradesh"),
    ("Amravati", "Maharashtra"), ("Bikaner", "Rajasthan"), ("Noida", "Uttar Pradesh"),
    ("Jamshedpur", "Jharkhand"), ("Bhilai", "Chhattisgarh"), ("Cuttack", "Odisha"),
    ("Firozabad", "Uttar Pradesh"), ("Kochi", "Kerala"), ("Nellore", "Andhra Pradesh"),
    ("Bhavnagar", "Gujarat"), ("Dehradun", "Uttarakhand"), ("Durgapur", "West Bengal"),
    ("Asansol", "West Bengal"), ("Rourkela", "Odisha"), ("Nanded", "Maharashtra"),
    ("Kolhapur", "Maharashtra"), ("Akola", "Maharashtra"), ("Kurnool", "Andhra Pradesh"),
    ("Rajahmundry", "Andhra Pradesh"), ("Kakinada", "Andhra Pradesh"), ("Tirupati", "Andhra Pradesh"),
    ("Shimoga", "Karnataka"), ("Mangalore", "Karnataka"), ("Belgaum", "Karnataka"),
    ("Gulbarga", "Karnataka"), ("Davanagere", "Karnataka"), ("Bellary", "Karnataka"),
    ("Bijapur", "Karnataka"), ("Tumkur", "Karnataka"), ("Raichur", "Karnataka"),
    ("Bidar", "Karnataka"), ("Hospet", "Karnataka"), ("Gadag", "Karnataka"),
    ("Chitradurga", "Karnataka"), ("Hassan", "Karnataka"), ("Shimoga", "Karnataka"),
    ("Guntur", "Andhra Pradesh"), ("Vijayawada", "Andhra Pradesh"), ("Nellore", "Andhra Pradesh"),
    ("Kurnool", "Andhra Pradesh"), ("Kadapa", "Andhra Pradesh"), ("Anantapur", "Andhra Pradesh"),
    ("Tirupati", "Andhra Pradesh"), ("Rajahmundry", "Andhra Pradesh"), ("Kakinada", "Andhra Pradesh"),
    ("Warangal", "Telangana"), ("Nizamabad", "Telangana"), ("Karimnagar", "Telangana"),
    ("Ramagundam", "Telangana"), ("Khammam", "Telangana"), ("Mahbubnagar", "Telangana"),
    ("Nalgonda", "Telangana"), ("Adilabad", "Telangana"), ("Suryapet", "Telangana"),
    ("Siddipet", "Telangana"), ("Coimbatore", "Tamil Nadu"), ("Madurai", "Tamil Nadu"),
    ("Tiruchirappalli", "Tamil Nadu"), ("Salem", "Tamil Nadu"), ("Tiruppur", "Tamil Nadu"),
    ("Erode", "Tamil Nadu"), ("Vellore", "Tamil Nadu"), ("Thoothukudi", "Tamil Nadu"),
    ("Dindigul", "Tamil Nadu"), ("Thanjavur", "Tamil Nadu"), ("Ranipet", "Tamil Nadu"),
    ("Sivakasi", "Tamil Nadu"), ("Karur", "Tamil Nadu"), ("Udhagamandalam", "Tamil Nadu"),
    ("Hosur", "Tamil Nadu"), ("Nagercoil", "Tamil Nadu"), ("Kanchipuram", "Tamil Nadu"),
    ("Kumarapalayam", "Tamil Nadu"), ("Karaikkudi", "Tamil Nadu"), ("Neyveli", "Tamil Nadu"),
    ("Thiruvananthapuram", "Kerala"), ("Kochi", "Kerala"), ("Kozhikode", "Kerala"),
    ("Thrissur", "Kerala"), ("Kollam", "Kerala"), ("Alappuzha", "Kerala"),
    ("Palakkad", "Kerala"), ("Malappuram", "Kerala"), ("Thalassery", "Kerala"),
    ("Ponnani", "Kerala"), ("Kannur", "Kerala"), ("Kasaragod", "Kerala"),
    ("Kottayam", "Kerala"), ("Pathanamthitta", "Kerala"), ("Idukki", "Kerala"),
    ("Guwahati", "Assam"), ("Silchar", "Assam"), ("Dibrugarh", "Assam"),
    ("Jorhat", "Assam"), ("Nagaon", "Assam"), ("Tinsukia", "Assam"),
    ("Tezpur", "Assam"), ("Bongaigaon", "Assam"), ("Dhubri", "Assam"),
    ("Diphu", "Assam"), ("North Guwahati", "Assam"), ("Imphal", "Manipur"),
    ("Shillong", "Meghalaya"), ("Aizawl", "Mizoram"), ("Kohima", "Nagaland"),
    ("Agartala", "Tripura"), ("Gangtok", "Sikkim"), ("Itanagar", "Arunachal Pradesh"),
    ("Dispur", "Assam"), ("Panaji", "Goa"), ("Margao", "Goa"),
    ("Vasco da Gama", "Goa"), ("Mapusa", "Goa"), ("Ponda", "Goa"),
    ("Srinagar", "Jammu and Kashmir"), ("Jammu", "Jammu and Kashmir"), ("Anantnag", "Jammu and Kashmir"),
    ("Leh", "Ladakh"), ("Kargil", "Ladakh"), ("Shimla", "Himachal Pradesh"),
    ("Dharamshala", "Himachal Pradesh"), ("Solan", "Himachal Pradesh"), ("Mandi", "Himachal Pradesh"),
    ("Palampur", "Himachal Pradesh"), ("Baddi", "Himachal Pradesh"), ("Nahan", "Himachal Pradesh"),
    ("Dehradun", "Uttarakhand"), ("Haridwar", "Uttarakhand"), ("Roorkee", "Uttarakhand"),
    ("Haldwani", "Uttarakhand"), ("Rudrapur", "Uttarakhand"), ("Kashipur", "Uttarakhand"),
    ("Rishikesh", "Uttarakhand"), ("Pithoragarh", "Uttarakhand"), ("Almora", "Uttarakhand"),
    ("Gangtok", "Sikkim"), ("Namchi", "Sikkim"), ("Gyalshing", "Sikkim"),
    ("Mangan", "Sikkim"), ("Port Blair", "Andaman and Nicobar Islands"), ("Daman", "Daman and Diu"),
    ("Silvassa", "Dadra and Nagar Haveli"), ("Kavaratti", "Lakshadweep"), ("Puducherry", "Puducherry"),
    ("Karaikal", "Puducherry"), ("Yanam", "Puducherry"), ("Mahe", "Puducherry"),
    ("Chandigarh", "Chandigarh"), ("New Delhi", "Delhi"), ("Noida", "Uttar Pradesh"),
    ("Greater Noida", "Uttar Pradesh"), ("Ghaziabad", "Uttar Pradesh"), ("Meerut", "Uttar Pradesh"),
    ("Agra", "Uttar Pradesh"), ("Aligarh", "Uttar Pradesh"), ("Allahabad", "Uttar Pradesh"),
    ("Bareilly", "Uttar Pradesh"), ("Gorakhpur", "Uttar Pradesh"), ("Jhansi", "Uttar Pradesh"),
    ("Muzaffarnagar", "Uttar Pradesh"), ("Saharanpur", "Uttar Pradesh"), ("Mathura", "Uttar Pradesh"),
    ("Firozabad", "Uttar Pradesh"), ("Ayodhya", "Uttar Pradesh"), ("Vrindavan", "Uttar Pradesh"),
    ("Moradabad", "Uttar Pradesh"), ("Sambhal", "Uttar Pradesh"), ("Rampur", "Uttar Pradesh"),
    ("Shahjahanpur", "Uttar Pradesh"), ("Azamgarh", "Uttar Pradesh"), ("Ballia", "Uttar Pradesh"),
    ("Faizabad", "Uttar Pradesh"), ("Basti", "Uttar Pradesh"), ("Deoria", "Uttar Pradesh"),
    ("Gonda", "Uttar Pradesh"), ("Sitapur", "Uttar Pradesh"), ("Bahraich", "Uttar Pradesh"),
    ("Barabanki", "Uttar Pradesh"), ("Sultanpur", "Uttar Pradesh"), ("Unnao", "Uttar Pradesh"),
    ("Rae Bareli", "Uttar Pradesh"), ("Lakhimpur", "Uttar Pradesh"), ("Pilibhit", "Uttar Pradesh"),
    ("Bijnor", "Uttar Pradesh"), ("Budaun", "Uttar Pradesh"), ("Etawah", "Uttar Pradesh"),
    ("Mainpuri", "Uttar Pradesh"), ("Etah", "Uttar Pradesh"), ("Fatehpur", "Uttar Pradesh"),
    ("Pratapgarh", "Uttar Pradesh"), ("Kaushambi", "Uttar Pradesh"), ("Ambedkar Nagar", "Uttar Pradesh"),
    # Common alternate spellings / extra tier-2 & tier-3 (autocomplete coverage)
    ("Bengaluru", "Karnataka"), ("Prayagraj", "Uttar Pradesh"), ("Gurugram", "Haryana"),
    ("Tirunelveli", "Tamil Nadu"), ("Kumbakonam", "Tamil Nadu"), ("Nagapattinam", "Tamil Nadu"),
    ("Mayiladuthurai", "Tamil Nadu"), ("Cuddalore", "Tamil Nadu"), ("Viluppuram", "Tamil Nadu"),
    ("Tiruvannamalai", "Tamil Nadu"), ("Namakkal", "Tamil Nadu"), ("Theni", "Tamil Nadu"),
    ("Tenkasi", "Tamil Nadu"), ("Sivaganga", "Tamil Nadu"), ("Pudukkottai", "Tamil Nadu"),
    ("Ramanathapuram", "Tamil Nadu"), ("Virudhunagar", "Tamil Nadu"), ("Mettupalayam", "Tamil Nadu"),
    ("Pollachi", "Tamil Nadu"), ("Gobichettipalayam", "Tamil Nadu"), ("Bhavani", "Tamil Nadu"),
    ("Rajapalayam", "Tamil Nadu"), ("Sathyamangalam", "Tamil Nadu"), ("Dharmapuri", "Tamil Nadu"),
    ("Krishnagiri", "Tamil Nadu"), ("Ambur", "Tamil Nadu"), ("Vaniyambadi", "Tamil Nadu"),
    ("Neyveli", "Tamil Nadu"), ("Panruti", "Tamil Nadu"), ("Tindivanam", "Tamil Nadu"),
    ("Chidambaram", "Tamil Nadu"), ("Sirkazhi", "Tamil Nadu"), ("Rameswaram", "Tamil Nadu"),
    ("Karaikudi", "Tamil Nadu"),
]


async def main():
    base = Path(__file__).resolve().parent.parent
    json_path = base / "data" / "places" / "places_india.json"
    from_json = await seed_from_json("IN", json_path)
    if from_json > 0:
        print(f"Seeded {from_json} India places from {json_path}.")
    else:
        n = await seed_from_list("IN", "India", INDIA_PLACES)
        print(f"Seeded {n} India places (embedded list).")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
