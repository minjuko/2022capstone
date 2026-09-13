from flask import Flask, jsonify, render_template

try:
    from .camp import CampCrawler
    from .equipment import EquipmentCrawler
except ImportError:
    from camp import CampCrawler
    from equipment import EquipmentCrawler


def register_campster_routes(app, camp_crawler=None, equipment_crawler=None):
    camp_crawler = camp_crawler or CampCrawler()
    equipment_crawler = equipment_crawler or EquipmentCrawler()

    @app.get("/")
    def index():
        return render_template("index.html")

    @app.get("/test")
    def test_page():
        return render_template("test.html")

    @app.get("/selection1/<uid>/<path:choice>")
    def equipment_selection(uid, choice):
        del uid
        return jsonify(equipment_crawler.request(choice, ""))

    @app.get("/selection2/<uid>/<path:tags>")
    def theme_selection(uid, tags):
        del uid
        answer = camp_crawler.request_debug("", "", tags)
        state = "SUCCESS" if answer else "NOT_FOUND"
        return jsonify({"state": state, "answer": answer})

    return app


def create_app(camp_crawler=None, equipment_crawler=None):
    app = Flask(__name__, template_folder="templates", static_folder="static")
    return register_campster_routes(app, camp_crawler, equipment_crawler)
