import ast
from pathlib import Path


def test_camp_scenario_is_registered_and_place_is_optional():
    root = Path(__file__).parents[1]
    application = (root / "campster" / "application.py").read_text(encoding="utf-8")
    scenario = (root / "campster" / "scenario.py").read_text(encoding="utf-8")
    tree = ast.parse(application)
    kochat_calls = [
        node
        for node in ast.walk(tree)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id == "KochatApi"
    ]
    scenarios = next(
        keyword.value
        for keyword in kochat_calls[0].keywords
        if keyword.arg == "scenarios"
    )
    assert "camp" in {item.id for item in scenarios.elts if isinstance(item, ast.Name)}
    assert '"PLACE": [" "]' in scenario
    assert "api=CampCrawler().request_debug" in scenario
    assert 'os.getenv("CAMPSTER_HOST", "127.0.0.1")' in application
    assert 'os.getenv("CAMPSTER_PORT", "8080")' in application
