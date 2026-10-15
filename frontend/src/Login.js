import React, { useState } from "react";
import axios from "axios";
import { baseurl } from "./App"; // Assuming baseurl is defined in App.js
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [usertype, setUsertype] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseurl}/login`, null, {
        params: { email, password, usertype },
      });

      // Check response and show appropriate toast
      if (response.status === 200) {
        sessionStorage.setItem("email", email);
        toast.success(response.data);

        // Navigate based on user type
        if (usertype === "User") {
          navigate("/UserDashboard");
        } else if (usertype === "Admin") {
          navigate("/AdminDashboard");
        } else if (usertype === "Manager") {
          navigate("/ManagerDashboard");
        }
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "130px" }}>
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          {/* User Type Dropdown */}
          <div className="mb-3">
            <label htmlFor="usertype" className="form-label">User Type</label>
            <select
              id="usertype"
              className="form-select"
              value={usertype}
              onChange={(e) => setUsertype(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {/* Registration Link */}
        <div className="text-center mt-3">
          <p>
            Not registered? <Link to="/register">Click here to register</Link>
          </p>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
