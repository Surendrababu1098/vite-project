from flask import Flask, request, jsonify
import json, os, random
from math import radians, sin, cos, sqrt, atan2
import folium

app = Flask(__name__)

# --------------------------------------------
# 🔹 PATH SETUP
# --------------------------------------------
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")

EMPLOYEE_FILE = os.path.join(DATA_DIR, "employees_data.json")
CUSTOMER_FILE = os.path.join(DATA_DIR, "customers_data.json")
GEOCACHE_FILE = os.path.join(DATA_DIR, "geocache_hyd.json")

# --------------------------------------------
# 🔹 LOAD JSON FILES
# --------------------------------------------
def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        print(f"⚠️ Missing file: {file_path}")
        return {}

employees = load_json(EMPLOYEE_FILE)
customers = load_json(CUSTOMER_FILE)
geocache = load_json(GEOCACHE_FILE)

# --------------------------------------------
# 🔹 HELPER: HAVERSINE DISTANCE
# --------------------------------------------
def haversine_distance(coord1, coord2):
    R = 6371.0  # Radius of Earth in km
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return round(R * c, 2)

# --------------------------------------------
# 🔹 ROUTE GENERATION LOGIC (SIMPLE VERSION)
# --------------------------------------------
def generate_optimized_route(employee, depot="L01"):
    emp_name = employee["name"]
    emp_id = employee["e_id"]

    # Simulate assigned locations (3-6 random places)
    assigned_places = random.sample(list(geocache.keys()), k=random.randint(3, 6))

    total_distance = 0.0
    for i in range(len(assigned_places) - 1):
        c1 = geocache[assigned_places[i]]
        c2 = geocache[assigned_places[i + 1]]
        total_distance += haversine_distance(c1, c2)

    return {
        "e_id": emp_id,
        "name": emp_name,
        "route": assigned_places,
        "distance_km": round(total_distance, 2),
    }

# --------------------------------------------
# 🔹 GENERATE MAP USING FOLIUM
# --------------------------------------------
def generate_map_html(route_data):
    route = route_data["route"]
    m = folium.Map(location=[17.4, 78.47], zoom_start=12)

    coords = [geocache[loc] for loc in route if loc in geocache]

    # Add markers
    for idx, loc in enumerate(coords):
        folium.Marker(
            location=loc,
            popup=f"{route[idx]}",
            icon=folium.Icon(color="blue" if idx else "green")
        ).add_to(m)

    # Draw route line
    folium.PolyLine(coords, color="red", weight=3, opacity=0.8).add_to(m)

    return m._repr_html_()

# --------------------------------------------
# 🔹 API: /optimized_route
# --------------------------------------------
@app.route("/optimized_route", methods=["POST"])
def optimized_route():
    data = request.get_json()
    emp_id = data.get("e_id")
    emp_name = data.get("name")
    depot = data.get("depot", "L01")

    employee = None
    if emp_id:
        employee = next((e for e in employees["employees"] if e["e_id"] == emp_id), None)
    elif emp_name:
        employee = next((e for e in employees["employees"] if e["name"].lower() == emp_name.lower()), None)

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    route_data = generate_optimized_route(employee, depot)
    return jsonify(route_data)

# --------------------------------------------
# 🔹 API: /optimized_map
# --------------------------------------------
@app.route("/optimized_map", methods=["POST"])
def optimized_map():
    data = request.get_json()
    emp_id = data.get("e_id")
    emp_name = data.get("name")
    depot = data.get("depot", "L01")

    employee = None
    if emp_id:
        employee = next((e for e in employees["employees"] if e["e_id"] == emp_id), None)
    elif emp_name:
        employee = next((e for e in employees["employees"] if e["name"].lower() == emp_name.lower()), None)

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    route_data = generate_optimized_route(employee, depot)
    map_html = generate_map_html(route_data)

    return jsonify({
        "e_id": employee["e_id"],
        "name": employee["name"],
        "map_html": map_html
    })

# --------------------------------------------
# 🔹 MAIN
# --------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5010, debug=True)
