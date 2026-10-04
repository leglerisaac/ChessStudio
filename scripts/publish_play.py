"""Publish one signed Chess Studio App Bundle to an existing Play closed test.

Credentials come from a GitHub environment secret and are never written to disk.
The script refuses to update production, open, or internal testing tracks.
"""

import argparse
import json
import os
from pathlib import Path
from urllib.parse import quote


PACKAGE = "com.leglord.chessstudio"
API = f"https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PACKAGE}"
UPLOAD_API = f"https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/{PACKAGE}"
SCOPE = "https://www.googleapis.com/auth/androidpublisher"
NON_CLOSED_TRACKS = {"production", "beta", "qa", "internal"}
ACTIVE_RELEASE_STATUSES = {"completed", "inProgress"}


def check_play_response(response, stage: str) -> None:
    """Include Play's useful error message without dumping response headers or credentials."""
    try:
        response.raise_for_status()
    except Exception:
        try:
            error = response.json().get("error", {})
        except (ValueError, TypeError, AttributeError):
            error = {}
        message = error.get("message") if isinstance(error, dict) else None
        if isinstance(message, str) and message.strip():
            status = getattr(response, "status_code", "unknown")
            raise RuntimeError(
                f"Play {stage} failed (HTTP {status}): {message.strip()[:1000]}"
            ) from None
        raise


def select_closed_track(tracks: list[dict], requested: str = "") -> str:
    """Choose an existing, active phone/tablet closed test without guessing."""
    eligible = {
        track["track"]
        for track in tracks
        if isinstance(track, dict)
        and isinstance(track.get("track"), str)
        and track["track"] not in NON_CLOSED_TRACKS
        and ":" not in track["track"]  # Exclude form-factor tracks.
        and any(
            release.get("status") in ACTIVE_RELEASE_STATUSES
            for release in track.get("releases", [])
            if isinstance(release, dict)
        )
    }
    requested = requested.strip()
    if requested:
        if requested not in eligible:
            raise ValueError(
                f"PLAY_CLOSED_TRACK={requested!r} is not an active closed test track. "
                f"Active closed tracks: {', '.join(sorted(eligible)) or 'none'}."
            )
        return requested
    if len(eligible) != 1:
        raise ValueError(
            "Set PLAY_CLOSED_TRACK to the intended closed test track name. "
            f"Active closed tracks: {', '.join(sorted(eligible)) or 'none'}."
        )
    return next(iter(eligible))


def publish_bundle(session, bundle: Path, name: str, notes: str, track_name: str = "") -> int:
    """Resolve the closed track, upload a bundle, assign it, then commit."""
    response = session.post(f"{API}/edits", json={}, timeout=30)
    check_play_response(response, "create edit")
    edit_id = quote(str(response.json()["id"]), safe="")

    response = session.get(f"{API}/edits/{edit_id}/tracks", timeout=30)
    check_play_response(response, "list tracks")
    track = select_closed_track(response.json().get("tracks", []), track_name)
    print(f"Targeting existing Play closed testing track: {track}", flush=True)

    with bundle.open("rb") as artifact:
        response = session.post(
            f"{UPLOAD_API}/edits/{edit_id}/bundles",
            params={"uploadType": "media"},
            headers={"Content-Type": "application/octet-stream"},
            data=artifact,
            timeout=300,
        )
    check_play_response(response, "upload App Bundle")
    version_code = int(response.json()["versionCode"])
    if not 1 <= version_code < 2_100_000_000:
        raise ValueError("Play returned an invalid bundle version code")

    release = {
        "name": name,
        "versionCodes": [str(version_code)],
        "status": "completed",
        "releaseNotes": [{"language": "en-US", "text": notes[:500]}],
    }
    response = session.put(
        f"{API}/edits/{edit_id}/tracks/{quote(track, safe='')}",
        json={"track": track, "releases": [release]},
        timeout=30,
    )
    check_play_response(response, "update closed track")

    # A pending Play review must not be silently cancelled by a later CI build.
    response = session.post(
        f"{API}/edits/{edit_id}:commit",
        params={"changesInReviewBehavior": "ERROR_IF_IN_REVIEW"},
        timeout=30,
    )
    check_play_response(response, "commit release")
    return version_code


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--notes", default="Chess Studio improvements and fixes.")
    parser.add_argument("--track", default=os.environ.get("PLAY_CLOSED_TRACK", ""),
                        help="Existing closed track name; optional if exactly one is active")
    args = parser.parse_args()

    if not args.bundle.is_file() or args.bundle.stat().st_size == 0:
        parser.error("--bundle must point to a nonempty signed App Bundle")
    credentials_json = os.environ.get("PLAY_SERVICE_ACCOUNT_JSON")
    if not credentials_json:
        parser.error("PLAY_SERVICE_ACCOUNT_JSON is missing")

    from google.auth.transport.requests import AuthorizedSession
    from google.oauth2 import service_account

    credentials = service_account.Credentials.from_service_account_info(
        json.loads(credentials_json), scopes=[SCOPE]
    )
    version_code = publish_bundle(
        AuthorizedSession(credentials), args.bundle, args.name, args.notes, args.track
    )
    print(f"Submitted Chess Studio version code {version_code} to Play closed testing.")


if __name__ == "__main__":
    main()
