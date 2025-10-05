import "./Reports.css";

function Reports() {
  const complaints = [
    {
      id: "C001",
      customerName: "Rahul Sharma",
      address: "Hyderabad, India",
      complaint: "Internet not working",
      date: "2025-10-03",
      status: "Pending"
    },
    {
      id: "C002",
      customerName: "Anita Singh",
      address: "Bangalore, India",
      complaint: "Billing issue",
      date: "2025-10-02",
      status: "Resolved"
    },
    {
      id: "C003",
      customerName: "John Doe",
      address: "Mumbai, India",
      complaint: "Slow service response",
      date: "2025-10-01",
      status: "In Progress"
    }
  ];

  return (
    <div className="reports-container">
      <h1>📋 Complaints Report</h1>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Customer Name</th>
            <th>Address</th>
            <th>Complaint</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, idx) => (
            <tr key={idx}>
              <td>{c.id}</td>
              <td>{c.customerName}</td>
              <td>{c.address}</td>
              <td>{c.complaint}</td>
              <td>{c.date}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
