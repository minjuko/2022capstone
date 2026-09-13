from kocrawl.dust import DustCrawler
from kocrawl.weather import WeatherCrawler
from kochat.app import Scenario
from kocrawl.map import MapCrawler
from camp import CampCrawler

weather = Scenario(
    intent="weather",
    api=WeatherCrawler().request,
    scenario={"LOCATION": [], "DATE": ["오늘"]},
)

dust = Scenario(
    intent="dust",
    api=DustCrawler().request,
    scenario={"LOCATION": [], "DATE": ["오늘"]},
)

restaurant = Scenario(
    intent="restaurant",
    api=MapCrawler().request,
    scenario={"LOCATION": [], "PLACE": ["맛집"]},
)

travel = Scenario(
    intent="travel",
    api=MapCrawler().request,
    scenario={"LOCATION": [], "PLACE": ["관광지"]},
)

camp = Scenario(
    intent="camp",
    api=CampCrawler().request_debug,
    scenario={
        "LOCATION": [],
        "DATE": ["오늘"],
        # A single space is stripped by CampCrawler and keeps PLACE optional
        # for the original KoChat Scenario implementation.
        "PLACE": [" "],
    },
)
