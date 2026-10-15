import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { toast } from "react-toastify";

const ViewRegisterEvents = () => {
  const [events, setEvents] = useState([]);
  
  // Get the email from sessionStorage
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      toast.error("No user logged in. Please log in.");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseurl}/events/user/${email}`);
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        } else {
          toast.info("No events found.");
        }
      } catch (error) {
        toast.error("Failed to fetch events.");
        console.error("Error fetching events:", error.message);
      }
    };

    fetchEvents();
  }, [email]);

  // Function to handle the status update (Confirm event)
  const handleConfirm = async (eventId) => {
    try {
      const response = await axios.put(`${baseurl}/updateEventStatus/${eventId}`);
      toast.success(response.data);
      // Refresh the events list after status update
      const updatedEvents = events.map((event) =>
        event.id === eventId ? { ...event, status: "Confirmed" } : event
      );
      setEvents(updatedEvents);
    } catch (error) {
      toast.error("Failed to update event status.");
      console.error("Error updating event status:", error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Registered Events</h2>
      {events.length > 0 ? (
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Event Type</th>
              <th>Name</th>
              <th>Date of Event</th>
              <th>Seats</th>
              <th>Estimated Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.eventType.eTypes}</td>
                <td>{event.name}</td>
                <td>{event.dateOfEvent}</td>
                <td>{event.seats}</td>
                <td>
                  {event.estimatedPrice ? (
                    `₹${event.estimatedPrice}`
                  ) : (
                    <span className="text-muted">Coming Soon</span>
                  )}
                </td>
                <td>
  <span
    className="badge"
    style={{
      backgroundColor: event.status === "Confirmed" ? "#3dfc04" : "#fc0404",  // Dark and gray shades
      color: "white"
    }}
  >
    {event.status}
  </span>
</td>

                <td>
                  {event.status !== "Confirmed" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirm(event.id)}
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events to display.</p>
      )}
    </div>
  );
};

export default ViewRegisterEvents;
