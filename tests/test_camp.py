from unittest.mock import Mock, patch

from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from campster.camp import CampCrawler, CampEditor, CampSearcher


class Collection:
    def __init__(self, rows=None, error=None):
        self.rows = rows or []
        self.error = error
        self.query = None

    def find(self, query):
        self.query = query
        if self.error:
            raise self.error
        return self.rows


def test_location_query_escapes_regular_expression():
    collection = Collection([{"facltNm": "A"}])
    result = CampSearcher(collection=collection).find_by_sigunguNm("서울.*")
    assert result == [{"facltNm": "A"}]
    assert collection.query == {
        "$or": [
            {"doNm": {"$regex": r"서울\.\*"}},
            {"sigunguNm": {"$regex": r"서울\.\*"}},
        ]
    }


def test_location_and_place_query():
    collection = Collection()
    CampSearcher(collection=collection).find_by_sigunguNm_and_lctCl("강원", "숲")
    assert collection.query == {
        "$and": [
            {
                "$or": [
                    {"doNm": {"$regex": "강원"}},
                    {"sigunguNm": {"$regex": "강원"}},
                ]
            },
            {"lctCl": {"$regex": "숲"}},
        ]
    }


def test_tag_query_uses_all_supported_fields_and_escapes_input():
    query = CampSearcher().make_tag_query("별+")
    assert query["$or"] == [
        {"themaEnvrnCl": {"$regex": r"별\+"}},
        {"lineIntro": {"$regex": r"별\+"}},
        {"intro": {"$regex": r"별\+"}},
        {"featureNm": {"$regex": r"별\+"}},
    ]


def test_result_cardinality_zero_to_three_is_preserved():
    for size in range(4):
        rows = [{"id": number} for number in range(size)]
        assert CampSearcher(collection=Collection(rows)).find_by_sigunguNm("x") == rows


def test_four_or_more_results_are_limited_to_three():
    rows = [{"id": number} for number in range(5)]
    with patch("campster.camp.randint", return_value=2):
        result = CampSearcher(collection=Collection(rows)).find_by_sigunguNm("x")
    assert result == rows[2:5]


def test_mongodb_connection_failures_return_empty_results():
    errors = (ConnectionFailure("down"), ServerSelectionTimeoutError("timeout"))
    for error in errors:
        assert (
            CampSearcher(collection=Collection(error=error)).find_by_sigunguNm("x")
            == []
        )


def test_mongodb_configuration(monkeypatch):
    factory = Mock()
    factory.return_value.kochat.camp = "collection"
    monkeypatch.setenv("CAMPSTER_MONGODB_URI", "mongodb://example.invalid:27017/db")
    monkeypatch.setenv("CAMPSTER_MONGODB_TIMEOUT_MS", "123")
    searcher = CampSearcher(mongo_client_factory=factory)
    assert searcher.mongodb_conn() == "collection"
    factory.assert_called_once_with(
        "mongodb://example.invalid:27017/db",
        connectTimeoutMS=123,
        serverSelectionTimeoutMS=123,
    )


def test_crawler_dispatches_location_place_and_tags():
    searcher = Mock()
    searcher.find_by_sigunguNm.return_value = []
    searcher.find_by_sigunguNm_and_lctCl.return_value = []
    searcher.find_by_tag.return_value = []
    crawler = CampCrawler(searcher)
    crawler.request_debug("서울", "오늘", "")
    searcher.find_by_sigunguNm.assert_called_once_with("서울")
    crawler.request_debug("서울", "오늘", "숲")
    searcher.find_by_sigunguNm_and_lctCl.assert_called_once_with(
        location="서울", lctCl="숲"
    )
    crawler.request_debug("", "오늘", "별, 바다")
    searcher.find_by_tag.assert_called_once_with(["별", "바다"])
    assert crawler.request_debug("", "오늘", "") == []


def test_editor_supplies_missing_frontend_fields():
    edited = CampEditor().edit_today([{"facltNm": "캠핑장"}])
    assert edited[0]["facltNm"] == "캠핑장"
    assert edited[0]["firstImageUrl"] == ""
