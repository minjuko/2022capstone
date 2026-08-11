import os
import json
import threading
import unittest
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import urlopen

import demo_server


class DemoServerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = demo_server.ThreadingHTTPServer(
            (demo_server.HOST, 0), demo_server.CampsterHandler
        )
        cls.server_thread = threading.Thread(
            target=cls.server.serve_forever, daemon=True
        )
        cls.server_thread.start()
        cls.base_url = f"http://{demo_server.HOST}:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.server_thread.join(timeout=2)

    def setUp(self):
        demo_server._camp_cache = (0, [])

    def request_json(self, path=None):
        path = path or f"/api/campsites?q={quote('서울')}"
        with urlopen(f"{self.base_url}{path}", timeout=2) as response:
            self.assertEqual(response.headers.get_content_type(), "application/json")
            return json.loads(response.read().decode("utf-8"))

    def test_as_items_accepts_single_item(self):
        payload = {
            "response": {"body": {"items": {"item": {"facltNm": "테스트 캠핑장"}}}}
        }
        self.assertEqual(demo_server._as_items(payload), [{"facltNm": "테스트 캠핑장"}])

    def test_normalize_camp_supplies_defaults(self):
        camp = demo_server._normalize_camp({"facltNm": "숲 캠프", "doNm": "경기도"})
        self.assertEqual(camp["name"], "숲 캠프")
        self.assertEqual(camp["address"], "주소 정보 없음")
        self.assertIn("경기도", camp["tags"])

    def test_rank_camps_prefers_matching_region(self):
        camps = [
            demo_server._normalize_camp(
                {"facltNm": "바다 캠프", "addr1": "강원도 강릉시"}
            ),
            demo_server._normalize_camp(
                {"facltNm": "숲 캠프", "addr1": "경기도 가평군"}
            ),
        ]
        result = demo_server._rank_camps(camps, "가평 캠핑장 추천")
        self.assertEqual(result[0]["name"], "숲 캠프")
        self.assertNotIn("_search", result[0])

    def test_missing_api_key_uses_controlled_error(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "GO_CAMPING_API_KEY"):
                demo_server.fetch_campsites("가평")

    def test_fallback_reason_does_not_expose_request_url(self):
        error = HTTPError(
            "https://example.test?serviceKey=secret-value",
            500,
            "server error",
            {},
            None,
        )
        try:
            self.assertEqual(demo_server._fallback_reason(error), "API_UNAVAILABLE")
            self.assertNotIn("secret-value", demo_server._fallback_reason(error))
        finally:
            error.close()

    def test_fallback_reason_distinguishes_expected_failures(self):
        self.assertEqual(
            demo_server._fallback_reason(RuntimeError("missing")),
            "API_KEY_NOT_CONFIGURED",
        )
        self.assertEqual(
            demo_server._fallback_reason(URLError("offline")),
            "API_UNAVAILABLE",
        )
        self.assertEqual(
            demo_server._fallback_reason(ValueError("bad json")),
            "INVALID_API_RESPONSE",
        )

    def test_fetch_campsites_uses_expected_request_and_timeout(self):
        response = MagicMock()
        response.read.return_value = json.dumps(
            {"response": {"body": {"items": {"item": []}}}}
        ).encode("utf-8")
        response.__enter__.return_value = response

        with patch.dict(os.environ, {"GO_CAMPING_API_KEY": "test-key"}, clear=True):
            with patch("demo_server.urlopen", return_value=response) as mocked_urlopen:
                demo_server.fetch_campsites("서울")

        request, = mocked_urlopen.call_args.args
        query = parse_qs(urlparse(request.full_url).query)
        self.assertEqual(urlparse(request.full_url).path, "/B551011/GoCamping/basedList")
        self.assertEqual(query["serviceKey"], ["test-key"])
        self.assertEqual(query["MobileOS"], ["ETC"])
        self.assertEqual(query["MobileApp"], ["CAMPSTER"])
        self.assertEqual(query["_type"], ["json"])
        self.assertEqual(mocked_urlopen.call_args.kwargs["timeout"], 12)

    def test_fetch_campsites_does_not_double_encode_encoded_service_key(self):
        response = MagicMock()
        response.read.return_value = json.dumps(
            {"response": {"body": {"items": {"item": []}}}}
        ).encode("utf-8")
        response.__enter__.return_value = response

        with patch.dict(
            os.environ, {"GO_CAMPING_API_KEY": "decoded%2Bkey%3D"}, clear=True
        ):
            with patch("demo_server.urlopen", return_value=response) as urlopen:
                demo_server.fetch_campsites("서울")

        query = parse_qs(urlparse(urlopen.call_args.args[0].full_url).query)
        self.assertEqual(query["serviceKey"], ["decoded+key="])

    def test_handler_without_api_key_returns_fallback_json(self):
        with patch.dict(os.environ, {}, clear=True):
            payload = self.request_json()

        self.assertEqual(payload["source"], "fallback")
        self.assertEqual(payload["reason"], "API_KEY_NOT_CONFIGURED")
        self.assertEqual(payload["items"], [])

    def test_handler_returns_live_items_as_valid_json(self):
        items = [{"name": "테스트 캠핑장", "tags": []}]
        with patch("demo_server.fetch_campsites", return_value=items):
            payload = self.request_json()

        self.assertEqual(payload, {"source": "live", "items": items})

    def test_handler_expected_errors_return_safe_fallback(self):
        errors = (
            HTTPError("https://example.test?serviceKey=secret-value", 500, "error", {}, None),
            URLError("offline"),
            TimeoutError("slow"),
            ValueError("invalid json"),
        )
        try:
            for error in errors:
                with self.subTest(error=type(error).__name__):
                    with patch("demo_server.fetch_campsites", side_effect=error):
                        payload = self.request_json()
                    serialized = json.dumps(payload)
                    self.assertEqual(payload["source"], "fallback")
                    self.assertEqual(payload["items"], [])
                    self.assertNotIn("secret-value", serialized)
                    self.assertNotIn("serviceKey", serialized)
        finally:
            errors[0].close()


if __name__ == "__main__":
    unittest.main()
