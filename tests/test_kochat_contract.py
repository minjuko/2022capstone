import importlib.util
import sys
import types
from pathlib import Path

from flask import Flask


def load_kochat_api():
    scenario_module = types.ModuleType("kochat.app.scenario")
    scenario_module.Scenario = object
    manager_module = types.ModuleType("kochat.app.scenario_manager")

    class Manager:
        def __init__(self):
            self.scenarios = []

        def add_scenario(self, scenario):
            self.scenarios.append(scenario)

        def apply_scenario(self, intent, entity, text):
            return {
                "input": text,
                "intent": intent,
                "entity": entity,
                "state": "SUCCESS",
                "answer": "ok",
            }

    manager_module.ScenarioManager = Manager
    dataset_module = types.ModuleType("kochat.data.dataset")
    dataset_module.Dataset = object
    decorators_module = types.ModuleType("kochat.decorators")

    def api(cls):
        cls.root_dir = ""
        cls.request_chat_url_pattern = "request_chat"
        cls.fill_slot_url_pattern = "fill_slot"
        cls.get_intent_url_pattern = "get_intent"
        cls.get_entity_url_pattern = "get_entity"
        return cls

    decorators_module.api = api
    modules = {
        "kochat.app.scenario": scenario_module,
        "kochat.app.scenario_manager": manager_module,
        "kochat.data.dataset": dataset_module,
        "kochat.decorators": decorators_module,
    }
    previous = {name: sys.modules.get(name) for name in modules}
    sys.modules.update(modules)
    try:
        path = Path(__file__).parents[1] / "kochat" / "app" / "kochat_api.py"
        spec = importlib.util.spec_from_file_location("contract_kochat_api", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module.KochatApi
    finally:
        for name, old in previous.items():
            if old is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = old


class Dataset:
    prep = types.SimpleNamespace(tokenize=lambda text, train=False: text.split())

    def load_predict(self, text, processor):
        return text


class Predictor:
    def __init__(self, value):
        self.value = value

    def predict(self, prep, **kwargs):
        return self.value


def test_request_chat_and_fill_slot_contract_with_models_mocked():
    KochatApi = load_kochat_api()
    api = KochatApi(Dataset(), object(), Predictor("camp"), Predictor(["LOCATION"]), [])
    client = api.app.test_client()
    first = client.get("/request_chat/user/%EC%84%9C%EC%9A%B8").get_json()
    assert first == {
        "answer": "ok",
        "entity": ["LOCATION"],
        "input": ["서울"],
        "intent": "camp",
        "state": "SUCCESS",
    }
    second = client.get("/fill_slot/user/%EC%88%B2").get_json()
    assert second["state"] == "SUCCESS"
    assert second["intent"] == "camp"
    assert second["input"] == ["숲", "서울"]
