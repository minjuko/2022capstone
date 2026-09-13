import os
import re
from random import randint

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError


class CampCrawler:
    """Dispatch CAMPSTER's region, site-type, and theme searches."""

    def __init__(self, searcher=None):
        self.searcher = searcher or CampSearcher()

    def _today_tag(self, tags: str):
        selected_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
        if not selected_tags:
            return []
        return CampEditor().edit_today(self.searcher.find_by_tag(selected_tags))

    def _today_location(self, location: str):
        result = CampEditor().edit_today(
            self.searcher.find_by_sigunguNm(location.strip())
        )
        return CampAnswerer().camp_form(location=location, result=result)

    def _today_location_place(self, location: str, place: str):
        result = CampEditor().edit_today(
            self.searcher.find_by_sigunguNm_and_lctCl(
                location=location.strip(), lctCl=place.strip()
            )
        )
        return CampAnswerer().camp_form(location=location, result=result)

    def request(self, location: str, date: str, place: str):
        try:
            return self.request_debug(location, date, place)
        except (ConnectionFailure, ServerSelectionTimeoutError):
            return []

    def request_debug(self, location: str, date: str, place: str):
        del date  # There is no date-specific CAMPSTER data contract.
        location = (location or "").strip()
        place = (place or "").strip()
        if location and place:
            return self._today_location_place(location, place)
        if location:
            return self._today_location(location)
        if place:
            return self._today_tag(place)
        return []


class CampAnswerer:
    def camp_form(self, location: str, result: list):
        del location
        return result


class CampEditor:
    require_fields = (
        "facltNm",
        "lineIntro",
        "addr1",
        "addr2",
        "posblFcltyCl",
        "animalCmgCl",
        "tel",
        "homepage",
        "firstImageUrl",
        "lctCl",
    )

    def edit_today(self, result: list) -> list:
        return [
            {field: row.get(field, "") for field in self.require_fields}
            for row in (result or [])
        ]


class CampSearcher:
    def __init__(self, collection=None, mongo_client_factory=MongoClient):
        self.collection = collection
        self.mongo_client_factory = mongo_client_factory

    def mongodb_conn(self):
        if self.collection is not None:
            return self.collection
        uri = os.getenv("CAMPSTER_MONGODB_URI", "mongodb://localhost:27017/")
        timeout_ms = int(os.getenv("CAMPSTER_MONGODB_TIMEOUT_MS", "5000"))
        client = self.mongo_client_factory(
            uri, connectTimeoutMS=timeout_ms, serverSelectionTimeoutMS=timeout_ms
        )
        return client.kochat.camp

    @staticmethod
    def _regex(value: str) -> dict:
        return {"$regex": re.escape(value)}

    @staticmethod
    def _sample(result) -> list:
        rows = list(result)
        if len(rows) <= 3:
            return rows
        start = randint(0, len(rows) - 3)
        return rows[start : start + 3]

    def _find(self, query: dict) -> list:
        try:
            return self._sample(self.mongodb_conn().find(query))
        except (ServerSelectionTimeoutError, ConnectionFailure):
            return []

    def find_by_sigunguNm(self, location: str) -> list:
        pattern = self._regex(location)
        return self._find({"$or": [{"doNm": pattern}, {"sigunguNm": pattern}]})

    def find_by_sigunguNm_and_lctCl(self, location: str, lctCl: str) -> list:
        pattern = self._regex(location)
        return self._find(
            {
                "$and": [
                    {"$or": [{"doNm": pattern}, {"sigunguNm": pattern}]},
                    {"lctCl": self._regex(lctCl)},
                ]
            }
        )

    def make_tag_query(self, place: str) -> dict:
        pattern = self._regex(place)
        return {
            "$or": [
                {"themaEnvrnCl": pattern},
                {"lineIntro": pattern},
                {"intro": pattern},
                {"featureNm": pattern},
            ]
        }

    def find_by_tag(self, tags) -> list:
        queries = [self.make_tag_query(tag) for tag in tags if tag]
        return self._find({"$and": queries}) if queries else []
