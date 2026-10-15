import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { toast } from "react-toastify";

const ViewAssignedEvents = () => {
  const [events, setEvents] = useState([]);

  // Fetch events with assigned managers
  useEffect(() => {
    const fetchAssignedEvents = async () => {
      try {
        const response = await axios.get(`${baseurl}/events/withManager`);
        console.log("Response from /events/assigned:", response.data);
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        } else {
          toast.info("No events with assigned managers to display.");
        }
      } catch (error) {
        toast.error("Failed to fetch events. Please try again.");
      }
    };

    fetchAssignedEvents();
  }, []);

  return (
    <div className="m-5">
      <h2 className="text-center mb-4">Assigned Events</h2>
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
        <th>Task Status</th>
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
            {event.manager ? (
              <span>{event.manager.email}</span>
            ) : (
              <span>No manager assigned</span>
            )}
          </td>
          {/* Conditional Coloring for Task Status */}
          <td>
            <span
              className="badge"
              style={{
                backgroundColor: event.task === "Processing" ? "#ff0000" : "#3dfc04",
                color: "white",
              }}
            >
              {event.task}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No events with assigned managers available.</p>
)}

    </div>
  );
};

export default ViewAssignedEvents;
