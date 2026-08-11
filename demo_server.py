"""CAMPSTER 정적 데모와 고캠핑 API 프록시를 실행합니다."""

from __future__ import annotations

import json
import os
import ssl
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, unquote, urlencode, urlparse
from urllib.request import Request, urlopen

HOST = "127.0.0.1"
PORT = int(os.getenv("CAMPSTER_PORT", "8000"))
ROOT = Path(__file__).resolve().parent
GO_CAMPING_URL = "https://apis.data.go.kr/B551011/GoCamping/basedList"
CACHE_SECONDS = 60 * 30
_camp_cache: tuple[float, list[dict]] = (0, [])
API_SSL_CONTEXT = ssl.create_default_context()
# The data.go.kr endpoint currently requires legacy-compatible TLS ciphers when
# called by Python builds linked against OpenSSL 3.x. Certificate checks remain on.
API_SSL_CONTEXT.set_ciphers("DEFAULT:@SECLEVEL=1")


def _load_env_file(path: Path = ROOT / ".env") -> None:
    """Load simple KEY=VALUE entries without replacing existing environment values."""
    if not path.is_file():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        name = name.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if name:
            os.environ.setdefault(name, value)


_load_env_file()


def _fallback_reason(error: Exception) -> str:
    """외부 요청 정보나 인증키가 응답에 노출되지 않도록 사유를 제한합니다."""
    if isinstance(error, RuntimeError):
        return "API_KEY_NOT_CONFIGURED"
    if isinstance(error, TimeoutError):
        return "API_TIMEOUT"
    if isinstance(error, (HTTPError, URLError)):
        return "API_UNAVAILABLE"
    return "INVALID_API_RESPONSE"


def _as_items(payload: dict) -> list[dict]:
    items = payload.get("response", {}).get("body", {}).get("items", {})
    if isinstance(items, dict):
        items = items.get("item", [])
    if isinstance(items, dict):
        return [items]
    return items if isinstance(items, list) else []


def _normalize_camp(item: dict) -> dict:
    tags = [
        value
        for value in (
            item.get("doNm"),
            item.get("sigunguNm"),
            item.get("induty"),
            item.get("lctCl"),
            "반려동물 가능" if item.get("animalCmgCl") not in ("", "불가능") else "",
        )
        if value
    ]
    return {
        "name": item.get("facltNm") or "이름 미제공 캠핑장",
        "description": item.get("lineIntro") or item.get("intro") or "상세 소개를 준비 중입니다.",
        "address": item.get("addr1") or "주소 정보 없음",
        "image": item.get("firstImageUrl") or "",
        "homepage": item.get("homepage") or "",
        "tags": tags[:4],
        "_search": " ".join(
            str(item.get(key, ""))
            for key in (
                "facltNm",
                "addr1",
                "doNm",
                "sigunguNm",
                "induty",
                "lctCl",
                "sbrsCl",
                "animalCmgCl",
                "lineIntro",
            )
        ).lower(),
    }


def _rank_camps(camps: list[dict], query: str) -> list[dict]:
    stop_words = ("캠핑장", "캠핑", "추천", "해줘", "좋은", "있는", "근교", "에서")
    tokens = [
        token
        for token in query.lower().replace(",", " ").split()
        if len(token) > 1 and token not in stop_words
    ]
    ranked = sorted(
        camps,
        key=lambda camp: sum(token in camp["_search"] for token in tokens),
        reverse=True,
    )
    if tokens:
        matched = [
            camp
            for camp in ranked
            if any(token in camp["_search"] for token in tokens)
        ]
        if matched:
            ranked = matched

    return [
        {key: value for key, value in camp.items() if key != "_search"}
        for camp in ranked[:3]
    ]


def fetch_campsites(query: str) -> list[dict]:
    global _camp_cache
    service_key = os.getenv("GO_CAMPING_API_KEY", "").strip()
    if not service_key:
        raise RuntimeError("GO_CAMPING_API_KEY가 설정되지 않았습니다.")

    params = {
        # data.go.kr provides both encoded and decoded keys. Normalize first so
        # urlencode below applies exactly one encoding pass in either case.
        "serviceKey": unquote(service_key),
        "MobileOS": "ETC",
        "MobileApp": "CAMPSTER",
        "_type": "json",
        "pageNo": 1,
        "numOfRows": 5000,
    }
    cached_at, cached_camps = _camp_cache
    if not cached_camps or time.time() - cached_at > CACHE_SECONDS:
        request = Request(
            f"{GO_CAMPING_URL}?{urlencode(params)}",
            headers={"User-Agent": "CAMPSTER-Portfolio/1.0"},
        )
        with urlopen(request, timeout=12, context=API_SSL_CONTEXT) as response:
            payload = json.loads(response.read().decode("utf-8"))
        cached_camps = [_normalize_camp(item) for item in _as_items(payload)]
        _camp_cache = (time.time(), cached_camps)

    return _rank_camps(cached_camps, query)


class CampsterHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/campsites":
            return super().do_GET()

        query = parse_qs(parsed.query).get("q", ["캠핑"])[0].strip() or "캠핑"
        try:
            camps = fetch_campsites(query)
            if not camps:
                self._json_response(
                    200,
                    {"source": "fallback", "reason": "검색 결과 없음", "items": []},
                )
                return
            self._json_response(200, {"source": "live", "items": camps})
        except (RuntimeError, HTTPError, URLError, TimeoutError, ValueError) as error:
            self._json_response(
                200,
                {
                    "source": "fallback",
                    "reason": _fallback_reason(error),
                    "items": [],
                },
            )

    def _json_response(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), CampsterHandler)
    print(f"CAMPSTER: http://{HOST}:{PORT}")
    print(
        "고캠핑 API: "
        + ("연결 모드" if os.getenv("GO_CAMPING_API_KEY") else "예시 데이터 모드")
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
    finally:
        server.server_close()
