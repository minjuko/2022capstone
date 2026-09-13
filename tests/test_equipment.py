import io
import json
import urllib.error
import urllib.parse

import pytest

from campster.equipment import (
    EquipmentConfigurationError,
    EquipmentCrawler,
    EquipmentSearcher,
)


class Response:
    def __init__(self, items, code=200):
        self.body = json.dumps({"items": items}).encode()
        self.code = code

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return None

    def getcode(self):
        return self.code

    def read(self):
        return self.body


def credentials(monkeypatch):
    monkeypatch.setenv("NAVER_CLIENT_ID", "client")
    monkeypatch.setenv("NAVER_CLIENT_SECRET", "secret")


def test_query_url_headers_and_timeout(monkeypatch):
    credentials(monkeypatch)
    calls = []

    def opener(request, timeout):
        calls.append((request, timeout))
        return Response([])

    EquipmentSearcher(opener=opener, timeout=2.5).search_naver_shopping(
        "텐트", "브랜드"
    )
    request, timeout = calls[0]
    query = urllib.parse.parse_qs(urllib.parse.urlsplit(request.full_url).query)
    assert query == {"display": ["5"], "query": ["텐트 브랜드"]}
    assert request.get_header("X-naver-client-id") == "client"
    assert request.get_header("X-naver-client-secret") == "secret"
    assert timeout == 2.5


@pytest.mark.parametrize("count", range(5))
def test_zero_to_four_results(monkeypatch, count):
    credentials(monkeypatch)
    items = [{"title": f"item-{number}"} for number in range(count)]
    result = EquipmentSearcher(
        opener=lambda request, timeout: Response(items)
    ).search_naver_shopping("텐트", "")
    assert len(result) == count


def test_missing_credentials_blocks_external_request(monkeypatch):
    monkeypatch.delenv("NAVER_CLIENT_ID", raising=False)
    monkeypatch.delenv("NAVER_CLIENT_SECRET", raising=False)
    opener = pytest.fail
    with pytest.raises(EquipmentConfigurationError):
        EquipmentSearcher(opener=opener)._make_request("텐트")


@pytest.mark.parametrize("error", [urllib.error.URLError("down"), TimeoutError("slow")])
def test_network_error_and_timeout_have_explicit_state(monkeypatch, error):
    credentials(monkeypatch)

    def opener(request, timeout):
        raise error

    result = EquipmentCrawler(EquipmentSearcher(opener=opener)).request("텐트", "")
    assert result["state"] == "ERROR"


def test_empty_result_and_html_marker_cleanup(monkeypatch):
    credentials(monkeypatch)
    crawler = EquipmentCrawler(
        EquipmentSearcher(opener=lambda request, timeout: Response([]))
    )
    assert crawler.request("텐트", "")["state"] == "NOT_FOUND"
    item = {"title": "<b>안전한</b> 텐트"}
    crawler = EquipmentCrawler(
        EquipmentSearcher(opener=lambda request, timeout: Response([item]))
    )
    result = crawler.request("텐트", "")
    assert result["state"] == "SUCCESS"
    assert result["answer"]["title"] == "안전한 텐트"
