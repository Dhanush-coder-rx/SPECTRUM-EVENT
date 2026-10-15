import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseurl } from "../App";
const ManageManager = () => {
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState({ email: "", password: "" });
  const [editManager, setEditManager] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch managers on component load
  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = () => {
    axios
      .get("http://localhost:8080/getAllManagers") // Replace with your endpoint
      .then((response) => setManagers(response.data))
      .catch((error) => console.error("Error fetching managers:", error));
  };

  // Handle new manager addition
  const handleAddManager = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/addManager", newManager)
      .then(() => {
        alert("Manager added successfully!");
        fetchManagers();
        setNewManager({ email: "", password: "" });
      })
      .catch((error) => console.error("Error adding manager:", error));
  };

  // Handle manager update
  const handleUpdateManager = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8080/updateManager", editManager)
      .then(() => {
        alert("Manager updated successfully!");
        fetchManagers();
        setIsEditing(false);
        setEditManager(null);
      })
      .catch((error) => console.error("Error updating manager:", error));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Managers</h2>

      {/* Add Manager Form */}
      <form onSubmit={handleAddManager} className="mb-5">
        <div className="row">
          <div className="col-md-5">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Manager Email"
              value={newManager.email}
              onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Manager Password"
              value={newManager.password}
              onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Add Manager
            </button>
          </div>
        </div>
      </form>

      {/* Managers Table */}
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((manager) => (
            <tr key={manager.id}>
              <td>{manager.id}</td>
              <td>{manager.email}</td>
              <td>{manager.password}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditManager(manager);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Manager Modal */}
      {isEditing && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Manager</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditing(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateManager}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={editManager.email}
                      onChange={(e) =>
                        setEditManager({ ...editManager, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={editManager.password}
                      onChange={(e) =>
                        setEditManager({ ...editManager, password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageManager;
