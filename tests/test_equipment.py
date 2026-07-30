import unittest

from demo.equipment import EquipmentCrawler


class EquipmentCrawlerTest(unittest.TestCase):
    def setUp(self):
        self.crawler = EquipmentCrawler()

    def test_known_category_returns_portfolio_guide(self):
        result = self.crawler.request("텐트")
        self.assertIn("돔 텐트", result)

    def test_unknown_category_returns_safe_general_guide(self):
        result = self.crawler.request("테이블")
        self.assertIn("사용 계절", result)
        self.assertIn("안전 인증", result)

    def test_debug_path_matches_normal_response(self):
        self.assertEqual(
            self.crawler.request_debug("침낭"),
            self.crawler.request("침낭"),
        )


if __name__ == "__main__":
    unittest.main()
