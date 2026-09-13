from pathlib import Path


SOURCE = (
    Path(__file__).parents[1] / "campster" / "static" / "js" / "main.js"
).read_text(encoding="utf-8")


def test_ajax_uses_same_origin_and_encodes_path_values():
    assert "http://127.0.0.1:8080" not in SOURCE
    assert "encodeURIComponent(messageText)" in SOURCE
    assert "encodeURIComponent(userName)" in SOURCE


def test_external_fields_use_safe_dom_apis():
    assert "p_name.textContent =" in SOURCE
    assert "li.textContent = text" in SOURCE
    assert "setSafeExternalUrl(a, 'href', homepage)" in SOURCE
    assert "setSafeExternalUrl(img, 'src', image)" in SOURCE
    assert "noopener noreferrer" in SOURCE


def test_user_message_is_escaped_before_html_rendering():
    assert "sendMessage(escapeHtml(messageText), 'right')" in SOURCE


def test_empty_external_results_are_handled_before_indexing():
    assert SOURCE.count("!Array.isArray(jsonArray) || jsonArray.length === 0") == 2
