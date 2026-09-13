import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request


NAVER_SHOPPING_URL = "https://openapi.naver.com/v1/search/shop"


class EquipmentConfigurationError(RuntimeError):
    pass


class EquipmentServiceError(RuntimeError):
    pass


class EquipmentSearcher:
    def __init__(self, opener=urllib.request.urlopen, timeout=None):
        self.opener = opener
        self.timeout = timeout or float(os.getenv("NAVER_API_TIMEOUT_SECONDS", "5"))

    @staticmethod
    def _make_query(category: str, brand: str) -> str:
        return " ".join(part.strip() for part in (category, brand) if part.strip())

    def _make_request(self, query: str):
        client_id = os.getenv("NAVER_CLIENT_ID")
        client_secret = os.getenv("NAVER_CLIENT_SECRET")
        if not client_id or not client_secret:
            raise EquipmentConfigurationError(
                "Naver API credentials are not configured"
            )
        url = f"{NAVER_SHOPPING_URL}?{urllib.parse.urlencode({'display': 5, 'query': query})}"
        return urllib.request.Request(
            url,
            headers={
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret,
            },
        )

    def search_naver_shopping(self, category: str, brand: str) -> list:
        request = self._make_request(self._make_query(category, brand))
        try:
            with self.opener(request, timeout=self.timeout) as response:
                if response.getcode() != 200:
                    raise EquipmentServiceError(
                        f"Naver API returned HTTP {response.getcode()}"
                    )
                payload = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise EquipmentServiceError("Naver API request failed") from exc

        fields = (
            "title",
            "link",
            "image",
            "lprice",
            "category1",
            "category2",
            "category3",
            "brand",
        )
        return [
            {field: item.get(field, "") for field in fields}
            for item in payload.get("items", [])[:5]
        ]


class EquipmentAnswerer:
    @staticmethod
    def clean_item(item: dict) -> dict:
        cleaned = dict(item)
        cleaned["title"] = re.sub(r"</?b>", "", cleaned.get("title", ""))
        return cleaned


class EquipmentCrawler:
    def __init__(self, searcher=None):
        self.searcher = searcher or EquipmentSearcher()

    def request(self, category: str, brand: str) -> dict:
        try:
            return self.request_debug(category, brand)
        except EquipmentConfigurationError:
            return {
                "state": "UNAVAILABLE",
                "answer": "장비 검색 인증 정보가 설정되지 않았습니다.",
            }
        except EquipmentServiceError:
            return {"state": "ERROR", "answer": "장비 검색 서비스 연결에 실패했습니다."}

    def request_debug(self, category: str, brand: str) -> dict:
        results = self.searcher.search_naver_shopping(category, brand)
        if not results:
            return {"state": "NOT_FOUND", "answer": "검색 결과가 없습니다."}
        return {
            "input": [],
            "intent": "equipment",
            "entity": [],
            "state": "SUCCESS",
            "answer": EquipmentAnswerer.clean_item(results[0]),
        }
