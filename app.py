#!/home/kristjan/Scripts/Bussiajad/.venv/bin/python

"""
Bussiajad - Tallinna bussi nr 8 reaalaja väljumised peatusest Oblika tee.
"""

from datetime import datetime
import zoneinfo
import requests
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Konfiguratsioon ja konstandid
STOP_ID = "1579"  # Oblika tee (kood: 19001-1 / SIRI id: 1579)
STOP_NAME = "Oblika tee"

BUS_CONFIG = {
    "8": {
        "number": "8",
        "name": "Buss 8",
        "destination": "Väike-Õismäe",
        "route_name": "Äigrumäe - Väike-Õismäe",
        "official_url": "https://transport.tallinn.ee/#bus/8/b-a/19001-1"
    },
    "8A": {
        "number": "8A",
        "name": "Buss 8A",
        "destination": "Viru keskus",
        "route_name": "Äigrumäe - Viru keskus",
        "official_url": "https://transport.tallinn.ee/#bus/8a/b-a/19001-1"
    }
}

ALLOWED_BUSES = set(BUS_CONFIG.keys())
SIRI_URL = f"https://transport.tallinn.ee/siri-stop-departures.php?stopid={STOP_ID}"
TIMEZONE = zoneinfo.ZoneInfo("Europe/Tallinn")


def format_seconds_to_time(seconds_from_midnight: int) -> str:
    """Teisendab ööpäeva algusest arvestatud sekundid formaati HH:MM."""
    hours = (seconds_from_midnight // 3600) % 24
    minutes = (seconds_from_midnight % 3600) // 60
    return f"{hours:02d}:{minutes:02d}"


def get_remaining_text(remaining_seconds: int) -> str:
    """Genereerib kasutajasõbraliku teksti järelejäänud aja kohta."""
    if remaining_seconds < 60:
        return "Nüüd"
    minutes = round(remaining_seconds / 60)
    return f"{minutes} min"


def fetch_departures(line_filter: str = None, limit: int = 4):
    """
    Pärib transport.tallinn.ee SIRI API-st peatusest väljuvad bussid
    ja filtreerib välja bussi nr 8 ja 8A järgmised väljumised.
    """
    now = datetime.now(TIMEZONE)
    updated_at_str = now.strftime("%H:%M:%S")

    selected_buses = {line_filter.upper()} if line_filter and line_filter.upper() in ALLOWED_BUSES else ALLOWED_BUSES

    try:
        headers = {
            "User-Agent": "BussiajadApp/1.0 (+https://github.com/)"
        }
        response = requests.get(SIRI_URL, headers=headers, timeout=6)
        response.raise_for_status()

        lines = [line.strip() for line in response.text.splitlines() if line.strip()]
        if not lines:
            return {
                "success": True,
                "departures": [],
                "updated_at": updated_at_str,
                "error": None,
                "message": "Praegu väljumisi ei leitud"
            }

        departures = []

        for line in lines[1:]:
            parts = line.split(",")
            # Formaat: Transport, RouteNum, ExpectedTimeInSeconds, ScheduleTimeInSeconds, Destination, RemainingSeconds, Flags
            if len(parts) >= 6:
                transport_type = parts[0].strip().lower()
                route_num = parts[1].strip().upper()

                if transport_type == "bus" and route_num in selected_buses:
                    try:
                        expected_sec = int(parts[2])
                        sched_sec = int(parts[3])
                        default_dest = BUS_CONFIG.get(route_num, {}).get("destination", "Tallinn")
                        destination = parts[4].strip() if len(parts) > 4 and parts[4].strip() else default_dest
                        remaining_sec = int(parts[5])
                        flags = parts[6].strip() if len(parts) > 6 else ""

                        is_realtime = ("Z" in flags) or (expected_sec != sched_sec)
                        delay_seconds = expected_sec - sched_sec
                        delay_minutes = round(delay_seconds / 60)

                        time_str = format_seconds_to_time(expected_sec)
                        sched_time_str = format_seconds_to_time(sched_sec)
                        remaining_mins = max(0, round(remaining_sec / 60))
                        remaining_text = get_remaining_text(remaining_sec)

                        departures.append({
                            "line": route_num,
                            "time": time_str,
                            "scheduled_time": sched_time_str,
                            "destination": destination,
                            "remaining_seconds": max(0, remaining_sec),
                            "remaining_minutes": remaining_mins,
                            "remaining_text": remaining_text,
                            "is_realtime": is_realtime,
                            "delay_minutes": delay_minutes,
                            "delay_text": f"+{delay_minutes} min" if delay_minutes > 0 else (f"{delay_minutes} min" if delay_minutes < 0 else "Graafikus")
                        })
                    except (ValueError, IndexError):
                        continue

        # Sorteeri väljumised kronoloogiliselt
        departures.sort(key=lambda d: d["remaining_seconds"])

        # Piira tulemused soovitud hulgaga
        limited_departures = departures[:limit]

        return {
            "success": True,
            "departures": limited_departures,
            "updated_at": updated_at_str,
            "error": None,
            "message": None if limited_departures else ("Liinil väljumisi ei leitud." if line_filter else "Praegu väljumisi ei leitud.")
        }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "departures": [],
            "updated_at": updated_at_str,
            "error": "Andmeühenduse tõrge transport.tallinn.ee serveriga.",
            "message": "Reaalaja andmeid ei õnnestunud laadida. Proovitakse automaatselt uuesti."
        }
    except Exception as e:
        return {
            "success": False,
            "departures": [],
            "updated_at": updated_at_str,
            "error": f"Tundmatu viga andmete töötlemisel: {str(e)}",
            "message": "Andmete kuvamisel tekkis tõrge."
        }


@app.route("/")
def index():
    """Pealeht - renderdab esmase vaate."""
    data = fetch_departures(limit=4)
    return render_template(
        "index.html",
        data=data,
        bus_config=BUS_CONFIG,
        stop_name=STOP_NAME
    )


@app.route("/api/departures")
def api_departures():
    """JSON API reaalaja andmete taustauuendusteks."""
    from flask import request
    line = request.args.get("line", None)
    data = fetch_departures(line_filter=line, limit=4)
    return jsonify(data)


if __name__ == "__main__":
    # Käivita arendusserver
    app.run(host="0.0.0.0", port=5000, debug=True)
