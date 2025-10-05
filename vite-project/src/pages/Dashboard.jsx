import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [depot, setDepot] = useState("");
  const [output, setOutput] = useState("");

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, newLocation]);
      setNewLocation("");
    }
  };

  const handleUpload = (type) => {
    const input = document.getElementById(`file-${type}`);
    if (!input || !input.files.length) {
      alert("⚠️ Please select a file first.");
      return;
    }
    const file = input.files[0];
    alert(`✅ "${file.name}" uploaded successfully.`);
  };

  const lookup = async () => {
    if (!empId && !empName) {
      setOutput('<p class="error-text">⚠️ Enter ID or Name</p>');
      return;
    }
    const params = new URLSearchParams();
    if (empId) params.set("e_id", empId);
    if (empName) params.set("name", empName);

    try {
      setOutput('<p class="info-text">🔍 Searching...</p>');
      const res = await fetch("http://4.240.91.148:5073/lookup_assigned?" + params.toString());
      const data = await res.json();
      if (!res.ok) {
        setOutput(`<p class="error-text">❌ ${data.error || "Not found"}</p>`);
        return;
      }

      let html = "";
      data.forEach((emp) => {
        html += `
          <div class="result-card">
            <h4>👤 ${emp.name} (${emp.e_id})</h4>
            <p><strong>Problem:</strong> ${emp.problem_occured || "N/A"}</p>
            <p><strong>Locations Assigned:</strong> ${emp.assigned_locations?.length || 0}</p>
            ${
              emp.assigned_locations?.length
                ? `<div class="locations-box">${emp.assigned_locations.join(", ")}</div>`
                : `<p class="muted-text">No locations assigned</p>`
            }
          </div>
        `;
      });
      setOutput(html);
    } catch (e) {
      setOutput(`<p class="error-text">❌ ${e.message}</p>`);
    }
  };

  const getOptimizedRoute = async () => {
    if (!empId && !empName) {
      setOutput('<p class="error-text">⚠️ Enter ID or Name</p>');
      return;
    }
    const depotLoc = depot || "L01";
    const params = new URLSearchParams();
    if (empId) params.set("e_id", empId);
    if (empName) params.set("name", empName);
    params.set("depot", depotLoc);

    try {
      setOutput('<p class="info-text">⚡ Calculating optimized route...</p>');
      const res = await fetch("http://127.0.0.1:5000/get_optimized_route?" + params.toString());
      const data = await res.json();
      if (!res.ok) {
        setOutput(`<p class="error-text">${data.error || "Not found"}</p>`);
        return;
      }

      const formatted = `
        <div class="result-card">
          <h4>${data.name} (${data.e_id}) – Optimized Route</h4>
          <p><strong>Problem:</strong> ${data.problem_occured}</p>
          <p><strong>Depot:</strong> ${data.depot}</p>
          <p><strong>Total Distance:</strong> ${data.total_distance}</p>
          <p><strong>Total Stops:</strong> ${data.route_summary.total_stops}</p>
        </div>
        <div class="route-box">
          <h5>📍 Route Sequence:</h5>
          <p>${data.optimized_route.join(" → ")}</p>
        </div>
      `;
      setOutput(formatted);
    } catch (e) {
      setOutput(`<p class="error-text">${e.message}</p>`);
    }
  };

  const clearResults = () => {
    setEmpId("");
    setEmpName("");
    setDepot("");
    setOutput("");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>CYIENT</h2>
        <ul>
          <li><Link to="/dashboard">🏠 Dashboard</Link></li>
          <li><Link to="/reports">📊 Reports</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header>
          <h1>Admin Dashboard</h1>
          <p>Manage uploads, locations, and employee routes</p>
        </header>

        <div className="stats-cards">
          <div className="card">
            <h3>Total Employees</h3>
            <p>45</p>
          </div>
          <div className="card">
            <h3>Total Locations</h3>
            <p>120</p>
          </div>
          <div className="card">
            <h3>Routes Assigned</h3>
            <p>30</p>
          </div>
        </div>

        {/* CSV Upload Section - Side by Side Cards */}
        <div className="problem-form">
          <h2>📂 Upload CSV Files</h2>
          <div className="upload-boxes">
            {["Edges", "Customers", "Employees"].map((label) => {
              const type = label.toLowerCase();
              return (
                <div className="upload-card" key={type}>
                  <h3>{label} CSV</h3>
                  <input type="file" id={`file-${type}`} accept=".csv" />
                  <button onClick={() => handleUpload(type)}>Upload</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Constraints */}
        <div className="problem-form">
          <h2>📍 Location Constraints</h2>
          <div className="form-inline">
            <input
              type="text"
              placeholder="Enter location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <button onClick={handleAddLocation}>Add</button>
          </div>
          <ul className="location-list">
            {locations.map((loc, i) => (
              <li key={i}>{loc}</li>
            ))}
          </ul>
        </div>

        {/* Route Optimizer */}
        <div className="problem-form">
          <h2>👤 Employee – Route Optimizer</h2>
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
            <button onClick={lookup}>Show Assignments</button>
            <button onClick={getOptimizedRoute}>Get Route</button>
            <button onClick={clearResults} className="btn-secondary">Clear</button>
          </div>
          <div
            id="out"
            className="results-container"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;