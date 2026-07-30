"""캠핑 장비 추천 시나리오.

2026년 종료된 Naver 쇼핑 검색 API 대신, 외부 서비스에 의존하지 않는
카테고리별 입문 장비 가이드를 제공합니다.
"""

EQUIPMENT_GUIDES = {
    "텐트": "초보자라면 설치가 간단한 2~3인용 돔 텐트를 추천합니다.",
    "침낭": "봄부터 초가을까지는 쾌적 온도를 확인한 3계절 침낭이 적합합니다.",
    "조명": "밝기 조절과 생활 방수를 지원하는 충전식 LED 랜턴을 추천합니다.",
}


class EquipmentCrawler:
    """기존 KoChat 시나리오가 사용하는 장비 추천 인터페이스."""

    def request(self, category: str, brand: str = "") -> str:
        del brand
        return EQUIPMENT_GUIDES.get(
            category,
            f"{category} 장비는 사용 계절, 수납 크기, 안전 인증을 우선 확인해 주세요.",
        )

    def request_debug(self, category: str, brand: str = "") -> str:
        return self.request(category, brand)
