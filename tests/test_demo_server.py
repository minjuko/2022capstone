import os
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

import demo_server


class DemoServerTest(unittest.TestCase):
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


if __name__ == "__main__":
    unittest.main()
