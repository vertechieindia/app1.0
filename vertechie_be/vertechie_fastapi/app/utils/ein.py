"""US EIN: 9 digits + IRS-published valid campus prefixes (no public checksum)."""

from __future__ import annotations

from typing import Final

# https://www.irs.gov/businesses/small-businesses-self-employed/how-eins-are-assigned-and-valid-ein-prefixes
_VALID_EIN_PREFIXES: Final[frozenset[str]] = frozenset(
    {
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "67",
        "68",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "80",
        "81",
        "82",
        "83",
        "84",
        "85",
        "86",
        "87",
        "88",
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "98",
        "99",
    }
)


def is_valid_ein_nine_digits(digits: str) -> bool:
    """True if 9-digit string uses a valid IRS-assigned prefix and basic hygiene."""
    if len(digits) != 9 or not digits.isdigit():
        return False
    if digits == "000000000":
        return False
    if len(set(digits)) == 1:
        return False
    return digits[:2] in _VALID_EIN_PREFIXES
