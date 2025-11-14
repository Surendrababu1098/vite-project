import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Customer from "./pages/CustomerPage";
import Reports from "./pages/Reports"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/reports" element={<Reports />} /> {/* ✅ Added route */}
      </Routes>
    </Router>
  );
}

export default App;
