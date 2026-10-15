import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePasswordmanager = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
        const email = sessionStorage.getItem("email");
      const response = await axios.put(`http://localhost:8080/updatePasswordManager/${email}`, null, {
        params: { newPassword },
      });

      if (response.status === 200) {
        toast.success(response.data);
        setEmail("");
        setNewPassword("");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4" style={{ maxWidth: "500px", margin: "auto" }}>
        <h3 className="text-center mb-4">Update Password</h3>
        <form onSubmit={handleUpdatePassword}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Update Password</button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdatePasswordmanager;
