import React, { useState } from "react";
import "./EmployeeDashboard.css";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [depot, setDepot] = useState("");
  const [output, setOutput] = useState("");
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [optimizedMapHtml, setOptimizedMapHtml] = useState(null);
  const navigate = useNavigate();

  const ROUTE_URL = "http://127.0.0.1:5010/optimized_route";
  const MAP_URL = "http://172.16.111.104:5010/optimized_map";

  const getOptimizedRoute = async () => {
    if (!empId && !empName) {
      setOutput('<p class="error-text">⚠️ Enter Employee ID or Name</p>');
      setOptimizedRoute(null);
      setOptimizedMapHtml(null);
      return;
    }

    const depotLoc = depot || "L01";

    try {
      setOutput('<p class="info-text">⚡ Calculating optimized route...</p>');
      setOptimizedMapHtml(null);
      const res = await fetch(ROUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          e_id: empId || null,
          name: empName || null,
          depot: depotLoc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`<p class="error-text">❌ ${data.error || "Error occurred"}</p>`);
        setOptimizedRoute(null);
        return;
      }

      setOptimizedRoute(data);

      const formatted = `
        <div class="result-card">
          <h4>${data.name} (${data.e_id}) – Optimized Route</h4>
          <p><strong>Total Distance:</strong> ${data.distance_km} km</p>
        </div>
        <div class="route-box">
          <h3>📍 Route Sequence:</h3>
          <p>${data.route.join(" → ")}</p>
        </div>
      `;
      setOutput(formatted);
    } catch (e) {
      setOutput(`<p class="error-text">❌ ${e.message}</p>`);
      setOptimizedRoute(null);
    }
  };

  const viewMap = async () => {
    if (!empId && !empName) {
      setOutput('<p class="error-text">⚠️ Enter Employee ID or Name</p>');
      setOptimizedMapHtml(null);
      return;
    }

    const depotLoc = depot || "L01";

    try {
      setOutput('<p class="info-text">🗺️ Generating optimized map...</p>');
      const res = await fetch(MAP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          e_id: empId || null,
          name: empName || null,
          depot: depotLoc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`<p class="error-text">❌ ${data.error || "Map generation failed"}</p>`);
        setOptimizedMapHtml(null);
        return;
      }

      if (data.map_html) {
        setOptimizedMapHtml(data.map_html);
        setOutput(`
          <div class="map-section">
            <h4>🗺️ Route Map Generated Successfully</h4>
            ${data.map_html}
          </div>
        `);
      } else {
        setOutput(`<p class="error-text">❌ No map HTML returned</p>`);
        setOptimizedMapHtml(null);
      }
    } catch (e) {
      setOutput(`<p class="error-text">❌ ${e.message}</p>`);
      setOptimizedMapHtml(null);
    }
  };

  const clearResults = () => {
    setEmpId("");
    setEmpName("");
    setDepot("");
    setOutput("");
    setOptimizedRoute(null);
    setOptimizedMapHtml(null);
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <div className="brand">CYIENT</div>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>

      <div className="employee-dashboard-box">
        <h2>Employee Route Optimizer</h2>
        <p>Manage your routes and find optimized paths efficiently 🚗</p>

        <div className="form-group">
          <input
            type="text"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Depot (default L01)"
            value={depot}
            onChange={(e) => setDepot(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button onClick={getOptimizedRoute}>Get Route</button>
          <button onClick={viewMap}>View Map</button>
          <button onClick={clearResults} className="btn-secondary">Clear</button>
        </div>

        <div
          id="out"
          className="results-container"
          dangerouslySetInnerHTML={{ __html: output }}
        />

        {/* Optionally, you can use the optimizedRoute and optimizedMapHtml state elsewhere in your UI */}
        {/* Example: */}
        {/* {optimizedRoute && (
          <pre>{JSON.stringify(optimizedRoute, null, 2)}</pre>
        )} */}
        {/* {optimizedMapHtml && (
          <div dangerouslySetInnerHTML={{ __html: optimizedMapHtml }} />
        )} */}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
