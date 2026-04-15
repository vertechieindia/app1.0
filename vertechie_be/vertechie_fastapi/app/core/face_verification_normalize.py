"""Normalize face_verification JSON from DB for APIs (legacy wrapped frames)."""

from __future__ import annotations

import json
from typing import Any, List, Optional


def normalize_stored_face_verification(value: Any) -> Optional[List[str]]:
    """
    Return a flat list of image data URL strings.

    Handles legacy shape where a JSON array of frames was stored as a single string
    inside a one-element list: ["[\\"data:image...,\\"...]"].
    """
    if value is None:
        return None
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None
        if s.startswith("["):
            try:
                value = json.loads(s)
            except json.JSONDecodeError:
                return None
        else:
            return [s]
    if not isinstance(value, list):
        return None
    items = [x for x in value if isinstance(x, str)]
    if len(items) == 1:
        s0 = items[0].strip()
        if s0.startswith("[") and s0.endswith("]"):
            try:
                inner = json.loads(s0)
                if isinstance(inner, list) and all(isinstance(x, str) for x in inner):
                    return [x for x in inner if x.strip()]
            except json.JSONDecodeError:
                pass
    out = [x for x in items if x.strip()]
    return out or None
