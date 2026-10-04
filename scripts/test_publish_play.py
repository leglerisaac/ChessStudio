"""Protect the order and closed-test scope of the Play release transaction."""

import tempfile
import unittest
from pathlib import Path

from publish_play import PACKAGE, publish_bundle, select_closed_track


TRACKS = {"tracks": [
    {"track": "production", "releases": [{"status": "completed"}]},
    {"track": "beta", "releases": [{"status": "completed"}]},
    {"track": "qa", "releases": [{"status": "completed"}]},
    {"track": "alpha", "releases": [{"status": "completed", "versionCodes": ["100171"]}]},
]}


class Response:
    def __init__(self, value=None, error=None, status_code=403):
        self.value = value or {}
        self.error = error
        self.status_code = status_code

    def json(self):
        return self.value

    def raise_for_status(self):
        if self.error:
            raise self.error


class Session:
    def __init__(self, responses):
        self.responses = iter(responses)
        self.calls = []

    def post(self, url, **kwargs):
        self.calls.append(("post", url, kwargs))
        return next(self.responses)

    def get(self, url, **kwargs):
        self.calls.append(("get", url, kwargs))
        return next(self.responses)

    def put(self, url, **kwargs):
        self.calls.append(("put", url, kwargs))
        return next(self.responses)


class PublishPlayTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.bundle = Path(self.directory.name) / "signed.aab"
        self.bundle.write_bytes(b"sample bundle")

    def test_closed_release_is_committed_only_after_upload_and_track_update(self):
        session = Session(
            [Response({"id": "17"}), Response(TRACKS), Response({"versionCode": 100181}), Response(), Response()]
        )
        code = publish_bundle(session, self.bundle, "Chess Studio 1.1", "Better lessons")
        self.assertEqual(code, 100181)
        self.assertEqual([call[0] for call in session.calls], ["post", "get", "post", "put", "post"])
        self.assertTrue(session.calls[1][1].endswith("/tracks"))
        self.assertEqual(session.calls[2][2]["data"].name, str(self.bundle))
        self.assertEqual(session.calls[2][2]["params"], {"uploadType": "media"})
        self.assertTrue(session.calls[3][1].endswith("/tracks/alpha"))
        self.assertEqual(session.calls[3][2]["json"]["track"], "alpha")
        release = session.calls[3][2]["json"]["releases"][0]
        self.assertEqual(release["versionCodes"], ["100181"])
        self.assertEqual(release["status"], "completed")
        self.assertEqual(session.calls[4][2]["params"], {"changesInReviewBehavior": "ERROR_IF_IN_REVIEW"})

    def test_requires_explicit_choice_for_multiple_closed_tracks(self):
        tracks = TRACKS["tracks"] + [{"track": "friends", "releases": [{"status": "completed"}]}]
        with self.assertRaisesRegex(ValueError, "Set PLAY_CLOSED_TRACK"):
            select_closed_track(tracks)
        self.assertEqual(select_closed_track(tracks, "friends"), "friends")

    def test_rejects_public_tracks_and_inactive_closed_tracks_before_upload(self):
        for track in ("production", "beta", "qa", "internal", "wear:alpha", "drafts"):
            with self.subTest(track=track), self.assertRaisesRegex(ValueError, "not an active closed test"):
                select_closed_track(TRACKS["tracks"] + [
                    {"track": "wear:alpha", "releases": [{"status": "completed"}]},
                    {"track": "drafts", "releases": [{"status": "draft"}]},
                ], track)
        session = Session([Response({"id": "17"}), Response({"tracks": []})])
        with self.assertRaisesRegex(ValueError, "Set PLAY_CLOSED_TRACK"):
            publish_bundle(session, self.bundle, "Chess Studio 1.1", "Updates")
        self.assertEqual([call[0] for call in session.calls], ["post", "get"])

    def test_publishing_target_matches_android_application_id(self):
        gradle = (Path(__file__).resolve().parent.parent / "android/app/build.gradle").read_text()
        self.assertIn(f"applicationId '{PACKAGE}'", gradle)

    def test_failed_upload_does_not_change_track_or_commit(self):
        session = Session([Response({"id": "17"}), Response(TRACKS), Response(error=RuntimeError("upload failed"))])
        with self.assertRaisesRegex(RuntimeError, "upload failed"):
            publish_bundle(session, self.bundle, "Chess Studio 1.1", "Updates")
        self.assertEqual(len(session.calls), 3)

    def test_failed_upload_shows_google_play_error_message(self):
        error = Response(
            {"error": {"message": "The upload key certificate does not match"}},
            error=RuntimeError("403 Forbidden"),
        )
        session = Session([Response({"id": "17"}), Response(TRACKS), error])
        with self.assertRaisesRegex(RuntimeError, "Play upload App Bundle failed \\(HTTP 403\\): The upload key certificate does not match"):
            publish_bundle(session, self.bundle, "Chess Studio 1.1", "Updates")
        self.assertEqual(len(session.calls), 3)

    def test_invalid_version_code_does_not_change_track_or_commit(self):
        session = Session([Response({"id": "17"}), Response(TRACKS), Response({"versionCode": 0})])
        with self.assertRaisesRegex(ValueError, "version code"):
            publish_bundle(session, self.bundle, "Chess Studio 1.1", "Updates")
        self.assertEqual(len(session.calls), 3)


if __name__ == "__main__":
    unittest.main()
