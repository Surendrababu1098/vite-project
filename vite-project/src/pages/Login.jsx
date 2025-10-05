import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === "admin" && password === "admin123") {
      navigate("/dashboard");
    } else if (username === "customer" && password === "customer123") {
      navigate("/customer", { state: { name: "Customer" } });
    } else {
      alert("Invalid credentials ❌ Try admin/admin123 or customer/customer123");
    }
  };

  return (
    <div className="login-container">
      {/* Background video */}
      <video autoPlay muted loop className="bg-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="login-card">
        <div className="brand">CYIENT</div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-box"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-box"
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        {/* Sign Up Button */}
        <button className="signup-btn">Sign Up</button>

        {/* Forgot Password */}
        <div className="forgot-container">
          <span className="forgot-btn">Forgot Password?</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
