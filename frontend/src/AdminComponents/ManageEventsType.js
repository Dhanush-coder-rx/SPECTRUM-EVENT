import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseurl } from "../App";

const ManageEventTypes = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [newEventType, setNewEventType] = useState("");
  const [editEventType, setEditEventType] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);  // Track edit mode

  // Fetch the event types from backend
  useEffect(() => {
    axios
      .get(`${baseurl}/getEventTypes`)
      .then((response) => {
        setEventTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event types:", error);
      });
  }, []);

  // Add new EventType
  const handleAddEventType = async () => {
    if (!newEventType) {
      toast.error("Event Type is required");
      return;
    }

    try {
      const response = await axios.post(
        `${baseurl}/addEventType`,
        null,
        {
          params: { eTypes: newEventType },
        }
      );
      toast.success(response.data);
      setNewEventType("");
      fetchEventTypes();
    } catch (error) {
      toast.error("Error adding Event Type or This event already exists");
    }
  };

  // Update EventType
  const handleUpdateEventType = async () => {
    if (!editEventType) {
      toast.error("Event Type is required");
      return;
    }

    try {
      const response = await axios.put(
        `${baseurl}/updateEventType/${editId}`,
        null,
        {
          params: { eTypes: editEventType },
        }
      );
      toast.success(response.data);
      setEditEventType("");
      setEditId(null);
      setIsEditing(false);  // Reset editing mode
      setNewEventType("");
      fetchEventTypes();
    } catch (error) {
      toast.error("Error updating Event Type");
    }
  };

  // Fetch event types again after adding or updating
  const fetchEventTypes = () => {
    axios
      .get("http://localhost:8080/getEventTypes")
      .then((response) => {
        setEventTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event types:", error);
      });
  };

  // Handle edit button click
  const handleEdit = (id, eType) => {
    setEditId(id);
    setEditEventType(eType);
    setIsEditing(true);  // Set to edit mode
  };

  // Handle add/update button based on editing state
  const handleEventTypeAction = () => {
    if (isEditing) {
      handleUpdateEventType();  // If editing, update
    } else {
      handleAddEventType();  // If not editing, add
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Event Types</h2>

      {/* Add or Update Event Type Form */}
      <div className="card p-4 mb-4">
        <h4>{isEditing ? "Edit Event Type" : "Add New Event Type"}</h4>
        <input
          type="text"
          className="form-control"
          value={isEditing ? editEventType : newEventType}
          onChange={(e) => (isEditing ? setEditEventType(e.target.value) : setNewEventType(e.target.value))}
          placeholder={isEditing ? "Update Event Type" : "Enter Event Type"}
        />
        <button
          className={`btn ${isEditing ? "btn-warning" : "btn-primary"} mt-2`}
          onClick={handleEventTypeAction}
        >
          {isEditing ? "Update Event Type" : "Add Event Type"}
        </button>
      </div>

      {/* Event Types Table */}
      <div className="card p-4">
        <h4>Existing Event Types</h4>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((event) => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.eTypes}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(event.id, event.eTypes)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ManageEventTypes;
