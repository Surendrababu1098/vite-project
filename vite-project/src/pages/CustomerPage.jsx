import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CustomerPage.css";

function CustomerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const customerName = location.state?.name || "Customer";

  const [locationInput, setLocationInput] = useState("");
  const [problemType, setProblemType] = useState("Select Problem");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: complaints.length + 1,
      location: locationInput,
      problem: problemType,
      description,
      assignedEmployee: "John Doe", // Placeholder
      expectedCompletion: "2025-10-10", // Placeholder
      status: "Pending",
    };
    setComplaints([...complaints, newComplaint]);
    setLocationInput("");
    setProblemType("Select Problem");
    setDescription("");
  };

  const filteredComplaints =
    activeTab === "All"
      ? complaints
      : complaints.filter((c) => c.status === activeTab);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Customer Dashboard</h1>
          <span>Welcome, {customerName}</span>
        </div>

        {/* ✅ Logout Button */}
        <button
          className="add-btn"
          onClick={() => navigate("/")} // Redirect to login page (root route)
        >
          🔒 Logout
        </button>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {["All", "Pending", "In Progress", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Complaints Grid */}
      <section className="complaints-grid">
        {filteredComplaints.length === 0 ? (
          <p className="empty-msg">No complaints found for {activeTab}</p>
        ) : (
          filteredComplaints.map((c) => (
            <div key={c.id} className="complaint-card">
              <h3>{c.problem}</h3>
              <p>
                <strong>Location:</strong> {c.location}
              </p>
              <p>
                <strong>Description:</strong> {c.description || "N/A"}
              </p>
              <p>
                <strong>Assigned:</strong> {c.assignedEmployee}
              </p>
              <p>
                <strong>Completion:</strong> {c.expectedCompletion}
              </p>
              <p
                className={`status ${c.status.toLowerCase().replace(" ", "-")}`}
              >
                {c.status}
              </p>
            </div>
          ))
        )}
      </section>

      {/* Complaint Form */}
      <section id="complaint-form" className="form-section">
        <h2>Raise a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Location</label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              required
              placeholder="Enter your location"
            />
          </div>
          <div className="form-group">
            <label>Problem Type</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              required
            >
              <option>Select Problem</option>
              <option>Internet</option>
              <option>Billing</option>
              <option>Service</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
            />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CustomerPage;