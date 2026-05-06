"""Strict Indian GSTIN validation (structure + state + embedded PAN + Luhn mod 36)."""

from __future__ import annotations

import re
from typing import Final

# Structure: [state 2][PAN 10][entity 1][Z][checksum 1]; entity 13th cannot be '0'.
_GSTIN_STRUCT: Final = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$")

_LUHN_ALPHABET: Final = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# GST state / UT codes (GST portal); includes 38 Ladakh.
_STATE_CODES: Final = frozenset(
    {
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
    }
)

# PAN 4th character: holder type (Income Tax / GST embedded PAN rules).
_PAN_HOLDER_TYPES: Final = frozenset("ABCFGHJKLMPTK")

_PAN_BODY: Final = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")


def _luhn_mod36_valid(gstin15: str) -> bool:
    """GSTIN check digit: Luhn mod 36 over full 15 characters."""
    n = len(_LUHN_ALPHABET)
    values = tuple(_LUHN_ALPHABET.index(c) for c in reversed(gstin15))
    total = sum(values[::2]) + sum(sum(divmod(i * 2, n)) for i in values[1::2])
    return total % n == 0


def _embedded_pan_valid(pan10: str) -> bool:
    if len(pan10) != 10 or not _PAN_BODY.match(pan10):
        return False
    if pan10[3] not in _PAN_HOLDER_TYPES:
        return False
    if pan10[5:9] == "0000":
        return False
    return True


def is_valid_gstin(compact_upper: str) -> bool:
    """Return True if `compact_upper` is a 15-char uppercase GSTIN passing all checks."""
    if len(compact_upper) != 15 or not _GSTIN_STRUCT.match(compact_upper):
        return False
    if compact_upper[:2] not in _STATE_CODES:
        return False
    if compact_upper[13] != "Z":
        return False
    if not _embedded_pan_valid(compact_upper[2:12]):
        return False
    return _luhn_mod36_valid(compact_upper)
