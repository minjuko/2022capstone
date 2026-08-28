# 캠핑 추천 챗봇 서비스 CAMPSTER

> 자연어 대화를 통해 사용자의 지역과 취향을 파악하고, 캠핑장과 캠핑 장비 탐색을 지원하는 KoChat 기반 모바일 챗봇 서비스

`CAMPSTER`는 2022년 전남대학교 소프트웨어공학과 **산학협력캡스톤**에서 진행한 6인 팀 프로젝트입니다.

오픈소스 챗봇 프레임워크 **KoChat**을 활용하여 사용자의 입력에서 탐색에 필요한 조건을 파악하고, 부족한 정보를 대화를 통해 단계적으로 수집하여 캠핑장과 캠핑 장비 정보를 제공하는 서비스를 구현했습니다.

> 프로젝트 당시 서버에 배포하여 시연했으며, 현재 서비스는 운영하지 않습니다.

<br>

## 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트 | CAMPSTER · 캠핑 추천 챗봇 |
| 기간 | 2022년 |
| 형태 | 전남대학교 소프트웨어공학과 산학협력캡스톤 |
| 인원 | 6명 |
| 담당 | Frontend 공동 구현 및 KoChat 연동 |
| 주요 기술 | JavaScript, jQuery, Bootstrap, KoChat, Flask, Python, MongoDB |
| 데이터 · API | GoCamping 기반 캠핑장 데이터, Naver Shopping Search API |
| 인프라 | NHN Cloud |

초기에는 범용적인 여행 추천 챗봇을 구상했으나, 프로젝트 피드백을 반영하여 **캠핑이라는 구체적인 Domain으로 범위를 좁혔습니다.**

사용자가 하나의 모바일 채팅 화면에서 지역과 취향에 맞는 캠핑장을 탐색하고, 필요한 캠핑 장비 정보까지 확인할 수 있도록 서비스 흐름을 구성했습니다.

<br>

## 주요 기능

### 1. 지역 기반 캠핑장 탐색

사용자의 지역 입력과 추가 조건을 대화를 통해 수집하고, 조건에 맞는 캠핑장 정보를 제공합니다.

- 지역 및 입지 조건 수집
- 필요한 조건이 부족할 경우 추가 질문
- 조건에 맞는 캠핑장 탐색
- 캠핑장 결과 및 상세정보 제공

### 2. 취향 기반 캠핑장 탐색

사용자가 원하는 캠핑 환경과 테마를 선택하고 관련 캠핑장을 탐색할 수 있도록 구성했습니다.

- 캠핑 테마 선택
- 선택한 취향 조건을 기반으로 캠핑장 검색
- 검색 결과를 채팅 화면의 Card 형태로 제공

### 3. 캠핑 장비 탐색

장비 Category와 세부 조건을 선택하여 관련 캠핑 상품 정보를 확인할 수 있도록 구현했습니다.

- 텐트, 침낭·매트, 조명, 화로·BBQ 등 Category 선택
- Naver Shopping Search API를 통한 상품 탐색
- 상품 이미지 및 기본 정보 제공

<br>

## 핵심 구현

### KoChat의 대화 상태를 Frontend Interaction으로 연결

Frontend에서는 KoChat API가 반환하는 `state`와 `answer`를 기반으로 다음 대화 흐름을 결정했습니다.

```javascript
if (state.includes('REQUIRE')) {
    return requestChat(messageText, 'fill_slot');
} else {
    return requestChat(messageText, 'request_chat');
}
```

최초 입력은 `request_chat`으로 전달하고, 필요한 정보가 부족한 `REQUIRE_*` 상태에서는 사용자의 다음 입력을 `fill_slot`으로 전달합니다.

이를 통해 단순히 챗봇의 응답 문자열을 출력하는 것이 아니라,

```text
사용자 입력
    ↓
KoChat Intent / Entity 분석
    ↓
Scenario 적용
    ↓
REQUIRE_* ──→ 추가 질문 ──→ fill_slot
    │
    └── SUCCESS ──→ 결과 UI
```

와 같이 **대화 상태에 따라 추가 질문과 결과 화면이 이어지는 Frontend Flow**를 구성했습니다.

> KoChat의 NLP 모델과 Framework 자체를 개발한 것은 아닙니다.  
> 오픈소스 KoChat의 Repository와 문서를 분석하고, CAMPSTER의 대화 흐름과 Frontend에 적용했습니다.

<br>

### 대화 조건과 캠핑장 검색 연결

캠핑장 정보는 **GoCamping 기반 데이터를 MongoDB에 저장하여 조회**하는 구조를 사용했습니다.

KoChat을 통해 확보한 지역·입지·테마 등의 조건을 CAMPSTER의 검색 로직과 연결하여 관련 캠핑장 데이터를 조회합니다.

```text
자연어 입력
    ↓
Intent / Entity / Slot Filling
    ↓
지역 · 입지 · 테마 조건 확보
    ↓
MongoDB 캠핑장 검색
    ↓
캠핑장 결과
    ↓
Frontend Card / 상세정보
```

캠핑장 탐색은 AI 모델이 결과의 순위를 직접 결정하는 방식이 아니라, **자연어 처리로 탐색 조건을 확보한 뒤 해당 조건으로 데이터를 검색하는 방식**으로 구현했습니다.

<br>

### 채팅 결과를 사용자 UI로 변환

Frontend는 **HTML5, CSS3, JavaScript, jQuery, Bootstrap**을 기반으로 모바일 채팅 인터페이스 형태로 구현했습니다.

주요 Interaction은 다음과 같습니다.

- 사용자 / 챗봇 메시지 렌더링
- 메시지 입력 및 전송
- 대화 진행에 따른 자동 Scroll
- 지역 · 테마 · 장비 선택 UI
- 캠핑장 결과 Card
- 캠핑장 상세정보
- 장비 상품 결과

Backend의 응답을 그대로 출력하는 데 그치지 않고, 응답 유형에 따라 **메시지, 선택 UI, 결과 Card, 상세정보가 자연스럽게 이어지도록 화면을 구성**했습니다.

<br>

## 담당 역할

Frontend 담당 팀원 3명이 화면과 서비스 흐름을 함께 논의하며 모바일 챗봇 UI를 공동 구현했습니다.

제가 참여한 주요 범위는 다음과 같습니다.

- 모바일 챗봇 UI 공동 구현
- 사용자 / 챗봇 메시지 및 Interaction 구현
- 지역 · 테마 · 장비 선택 UI 구현 참여
- 캠핑장 결과 및 상세정보 UI 구현 참여
- KoChat Repository 및 문서 분석
- `request_chat`, `fill_slot` 기반 Frontend 연동
- `state`, `answer`, `SUCCESS`, `REQUIRE_*`에 따른 화면 Flow 연결
- Frontend와 챗봇 응답 구조 조율

특히 **자연어 처리 결과와 대화 상태를 실제 사용자의 채팅 Interaction으로 연결하는 Frontend 구현**에 중점을 두었습니다.

<br>

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript, jQuery, Bootstrap |
| Chatbot / Backend | KoChat, Flask, Python |
| NLP | KoChat Intent Classification, Entity Recognition, Scenario, Slot Filling 활용 |
| Database | MongoDB |
| Data | GoCamping 기반 캠핑장 데이터 |
| External API | Naver Shopping Search API |
| Infrastructure | NHN Cloud |
| Collaboration | GitHub, Slack, Zoom, Google Docs · Sheets, Notion |

NHN Cloud 서버 및 GPU 환경은 학교의 개발환경 지원사업을 통해 프로젝트 개발 환경으로 활용했습니다.

<br>

## Repository Structure

```text
.
├── campster/               # CAMPSTER Application
│   ├── application.py
│   ├── camp.py             # 캠핑장 조건 검색
│   ├── equipment.py        # 캠핑 장비 상품 탐색
│   ├── scenario.py         # CAMPSTER Scenario
│   ├── static/             # Frontend CSS / JavaScript / Assets
│   └── templates/          # Frontend Templates
│
├── kochat/                 # KoChat Open Source Framework
├── docs/                   # KoChat 관련 문서
├── requirements.txt
├── setup.py
└── LICENSE
```

`campster/`에는 CAMPSTER 서비스에 적용한 코드가, `kochat/`에는 프로젝트에서 활용한 KoChat Framework 코드가 포함되어 있습니다.

KoChat 관련 Source와 License는 기존 **Apache License 2.0** 및 저작권 고지를 유지합니다.

<br>

## 데이터 및 외부 서비스

### 캠핑장

GoCamping 기반 캠핑장 데이터를 활용했으며, 서비스에서는 MongoDB에 저장된 데이터를 지역·입지·테마 등의 조건으로 조회했습니다.

### 캠핑 장비

Naver Shopping Search API를 활용하여 캠핑 장비와 관련된 상품 정보를 조회했습니다.

> Naver Shopping Search API는 현재 서비스가 종료되어 프로젝트 당시와 동일한 방식으로 사용할 수 없습니다.

<br>

## 프로젝트 정리

이 프로젝트를 통해 **오픈소스 챗봇 Framework의 동작 구조를 분석하고, 자연어 처리 결과와 대화 상태를 실제 Frontend Interaction으로 연결하는 과정**을 경험했습니다.

또한 하나의 요청과 응답으로 끝나는 일반적인 화면과 달리, 이전 대화의 상태에 따라 다음 질문과 UI가 달라지는 챗봇 서비스의 Frontend Flow를 구현하면서 **Frontend와 챗봇 API 사이의 상태 및 응답 구조를 맞추는 중요성**을 확인했습니다.

2022년 프로젝트의 기능 및 대화 로직은 기존 구현을 보존했으며, 포트폴리오 정리 과정에서 레이아웃, 채팅 Bubble, 선택 UI, 결과 Card 등 **Presentation 영역의 화면 스타일만 개선**했습니다.

현재 서비스는 운영하지 않으며, Repository는 당시 프로젝트의 구현 과정과 기술 적용 내용을 확인할 수 있도록 보존하고 있습니다.

<br>

## Credits

- 2022 전남대학교 소프트웨어공학과 산학협력캡스톤 6인 팀 프로젝트
- KoChat Open Source Framework
- KoChat 관련 Source는 [Apache License 2.0](./LICENSE)에 따라 사용했습니다.
