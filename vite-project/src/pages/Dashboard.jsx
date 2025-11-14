import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [output, setOutput] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const handleUpload = () => {
    const input = document.getElementById("file-employees");
    if (!input || !input.files.length) {
      alert("⚠️ Please select a file first.");
      return;
    }
    const file = input.files[0];
    alert(`✅ "${file.name}" uploaded successfully.`);
  };

  const reports = [
    {
      id: 1,
      customer_name: "Ravi Kumar",
      issue: "Delivery delayed by 2 days",
      status: "Pending",
      date: "2025-10-04",
    },
    {
      id: 2,
      customer_name: "Priya Sharma",
      issue: "Wrong product delivered",
      status: "Resolved",
      date: "2025-10-03",
    },
    {
      id: 3,
      customer_name: "Anil Verma",
      issue: "Product damaged during transit",
      status: "In Progress",
      date: "2025-10-05",
    },
  ];

  const openReportModal = (report) => {
    setSelectedReport(report);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>CYIENT</h2>
        <ul>
          <li><Link to="/dashboard" className="active">🏠 Dashboard</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header>
          <h1>Admin Dashboard</h1>
          <p>Manage employee data and view reports</p>
        </header>

        <div className="stats-cards">
          <div className="card">
            <h3>Total Employees</h3>
            <p>45</p>
          </div>
        </div>

        <div className="problem-form">
          <h2>📂 Upload Employee CSV</h2>
          <div className="upload-boxes">
            <div className="upload-card">
              <h3>Employees CSV</h3>
              <input type="file" id="file-employees" accept=".csv" />
              <button onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>

        <div className="reports-section">
          <h2>📊 Reports Raised by Customers</h2>
          <div className="reports-grid">
            {reports.map((rep) => (
              <div key={rep.id} className="report-card" onClick={() => openReportModal(rep)}>
                <div className="report-header">
                  <h3>{rep.customer_name}</h3>
                  <span className={`status-badge ${rep.status.toLowerCase().replace(" ", "-")}`}>
                    {rep.status}
                  </span>
                </div>
                <p className="issue-text">🧾 {rep.issue}</p>
                <div className="report-footer">
                  <p><strong>Date:</strong> {rep.date}</p>
                  <p><strong>ID:</strong> #{rep.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="out" className="results-container" dangerouslySetInnerHTML={{ __html: output }} />

        {selectedReport && (
          <div className="modal-overlay" onClick={closeReportModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedReport.customer_name}</h2>
              <p>🧾 {selectedReport.issue}</p>
              <p><strong>Date:</strong> {selectedReport.date}</p>
              <p><strong>ID:</strong> #{selectedReport.id}</p>

              <div className="progress-line">
                <span className={`dot ${selectedReport.status === "Pending" ? "active" : ""}`}>Pending</span>
                <span className={`dot ${selectedReport.status === "In Progress" ? "active" : ""}`}>In Progress</span>
                <span className={`dot ${selectedReport.status === "Resolved" ? "active" : ""}`}>Resolved</span>
              </div>

              <button onClick={closeReportModal}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;