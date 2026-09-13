from unittest.mock import Mock

from campster.web import create_app


def test_basic_page_is_served_without_models_or_external_services():
    app = create_app(Mock(), Mock())
    response = app.test_client().get("/")
    assert response.status_code == 200
    assert b"CAMPSTER" in response.data


def test_selection_routes_match_frontend_contract():
    camp = Mock()
    camp.request_debug.return_value = [{"facltNm": "A"}]
    equipment = Mock()
    equipment.request.return_value = {"state": "SUCCESS", "answer": {"title": "T"}}
    client = create_app(camp, equipment).test_client()
    assert (
        client.get("/selection2/user/%EB%B3%84%2C%EB%B0%94%EB%8B%A4").get_json()[
            "state"
        ]
        == "SUCCESS"
    )
    camp.request_debug.assert_called_once_with("", "", "별,바다")
    assert (
        client.get("/selection1/user/%ED%85%90%ED%8A%B8").get_json()["state"]
        == "SUCCESS"
    )
    equipment.request.assert_called_once_with("텐트", "")
