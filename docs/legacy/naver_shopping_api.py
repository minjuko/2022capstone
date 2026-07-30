"""2022년 CAMPSTER 장비 검색 구현 기록.

당시 Naver 쇼핑 검색 API를 이용했던 구조를 포트폴리오 기록 목적으로
보존한 파일입니다. 서비스 종료로 현재 애플리케이션에서는 불러오지 않습니다.
원본에 포함됐던 자격 증명과 import 시 자동 호출 코드는 제거했습니다.
"""

import json
import os
import re
import urllib.parse
import urllib.request


class EquipmentSearcher:
    def _make_query(self, category: str, brand: str) -> str:
        del brand
        return category

    def search_naver_shopping(self, category: str, brand: str) -> list[dict]:
        client_id = os.getenv("NAVER_CLIENT_ID")
        client_secret = os.getenv("NAVER_CLIENT_SECRET")
        if not client_id or not client_secret:
            raise RuntimeError("Naver API 자격 증명이 필요합니다.")

        query = urllib.parse.quote(self._make_query(category, brand))
        url = f"https://openapi.naver.com/v1/search/shop?display=5&query={query}"
        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id", client_id)
        request.add_header("X-Naver-Client-Secret", client_secret)

        with urllib.request.urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))

        return [
            {
                "title": item["title"],
                "link": item["link"],
                "image": item["image"],
                "lprice": item["lprice"],
            }
            for item in payload.get("items", [])
        ]


class EquipmentAnswerer:
    def map_form(self, category: str, brand: str, result: list[dict]) -> str:
        del brand
        messages = []
        for index, item in enumerate(result, start=1):
            title = re.sub(r"</?b>", "", item["title"])
            messages.append(
                f"'{category}' 카테고리의 {index}번째 검색결과입니다.\n"
                f"{title}\n"
                f"{item['lprice']}원\n"
                f"바로가기: {item['link']}\n"
                f"사진보기: {item['image']}"
            )
        return "\n\n".join(messages)


class EquipmentCrawler:
    def request(self, category: str, brand: str) -> str:
        try:
            items = EquipmentSearcher().search_naver_shopping(category, brand)
            return EquipmentAnswerer().map_form(category, brand, items)
        except Exception:
            return "해당 장비는 알 수 없습니다."
