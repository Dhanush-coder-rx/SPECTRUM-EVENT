import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { toast } from "react-toastify";

const AssignEvents = () => {
  const [events, setEvents] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState({});

  // Fetch confirmed events and managers on component mount
  useEffect(() => {
    const fetchConfirmedEvents = async () => {
      try {
        const response = await axios.get(`${baseurl}/events/confirmed`);
        console.log("Response from /events/confirmed:", response.data);
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        } else {
          toast.info("No confirmed events to display.");
        }
      } catch (error) {
        toast.error("Failed to fetch events. Please try again.");
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${baseurl}/getAllManagers`);
        setManagers(response.data);
      } catch (error) {
        toast.error("Failed to fetch managers. Please try again.");
      }
    };

    fetchConfirmedEvents();
    fetchManagers();
  }, []);

  // Assign manager to an event
  const handleAssignManager = async (eventId) => {
    if (!selectedManager[eventId]) {
      toast.warn("Please select a manager.");
      return;
    }

    try {
      const managerId = selectedManager[eventId];
      await axios.put(`${baseurl}/assignManager/${eventId}/${managerId}`);

      // Update the event with the assigned manager
      const updatedEvents = events.map((event) => {
        if (event.id === eventId) {
          const assignedManager = managers.find(
            (manager) => manager.id === parseInt(managerId)
          );
          return { ...event, manager: assignedManager };
        }
        return event;
      });

      setEvents(updatedEvents);
      toast.success("Manager assigned successfully!");
    } catch (error) {
      toast.error("Failed to assign manager. Please try again.");
    }
  };

  return (
    <div className="m-5">
      <h2 className="text-center mb-4">Assign Events</h2>
      {events.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Event Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date of Event</th>
              <th>Seats</th>
              <th>Estimated Price</th>
              <th>Status</th>
              <th>Manager</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.eventType.eTypes}</td>
                <td>{event.name}</td>
                <td>{event.phone}</td>
                <td>{event.address}</td>
                <td>{event.dateOfEvent}</td>
                <td>{event.seats}</td>
                <td>{event.estimatedPrice}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: "#3dfc04",
                      color: "white",
                    }}
                  >
                    {event.status}
                  </span>
                </td>
                <td>
                  {/* Check if a manager is already assigned */}
                  {event.manager ? (
                    <span>{event.manager.email}</span>
                  ) : (
                    // Display dropdown to select manager if not assigned
                    <select
                      className="form-control"
                      value={selectedManager[event.id] || ""}
                      onChange={(e) =>
                        setSelectedManager({
                          ...selectedManager,
                          [event.id]: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Manager
                      </option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.email}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {/* Display "Assign" button only if no manager is assigned */}
                  {!event.manager ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAssignManager(event.id)}
                    >
                      Assign
                    </button>
                  ) : (
                    <span>Manager Assigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No confirmed events available for assignment.</p>
      )}
    </div>
  );
};

export default AssignEvents;
