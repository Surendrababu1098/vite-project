import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./CustomerPage.css";

function CustomerPage() {
  const location = useLocation();
  const customerName = location.state?.name || "Customer";

  const [locationInput, setLocationInput] = useState("");
  const [problemType, setProblemType] = useState("Select Problem");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted!\nName: ${customerName}\nLocation: ${locationInput}\nProblem: ${problemType}\nDescription: ${description}`);
  };

  return (
    <div className="customer-container">
      <div className="customer-card">
        <h1>Welcome, {customerName} 👋</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🏠 Your Location</label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              required
              placeholder="Enter your location"
            />
          </div>

          <div className="form-group">
            <label>🚨 Problem Type</label>
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
            <label>✏️ Description (Optional)</label>
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
      </div>
    </div>
  );
}

export default CustomerPage;
