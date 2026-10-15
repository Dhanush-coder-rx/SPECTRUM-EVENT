import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { toast } from "react-toastify";

const ManageRegEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingPrice, setEditingPrice] = useState({});

  // Fetch processing events
  useEffect(() => {
    const fetchProcessingEvents = async () => {
      try {
        const response = await axios.get(`${baseurl}/events/processing`);
        setEvents(response.data);
      } catch (error) {
        toast.error("Failed to fetch events. Please try again later.");
      }
    };
    fetchProcessingEvents();
  }, []);

  // Handle price update
  const handleUpdatePrice = async (eventId) => {
    const price = editingPrice[eventId]; // Get the entered price for this event
    if (!price) {
      toast.error("Please enter an estimated price.");
      return;
    }

    try {
      const response = await axios.put(
        `${baseurl}/updateEstimatedPrice/${eventId}`,
        null,
        { params: { estimatedPrice: price } }
      );
      toast.success(response.data);

      // Update the local event list after successful update
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, estimatedPrice: price } : event
        )
      );
      setEditingPrice((prev) => ({ ...prev, [eventId]: "" })); // Clear the input field for this event
    } catch (error) {
      toast.error(
        error.response?.data || "Failed to update estimated price. Try again."
      );
    }
  };

  return (
    <div className=" m-4">
      <h2 className="text-center mb-4">Manage Estimated Price</h2>
      {events.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Event Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Date of Event</th>
              <th>Seats</th>
              <th>Description</th>
              <th>Address</th>
              <th>Status</th>
              <th>Estimated Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.eventType.eTypes}</td>
                <td>{event.name}</td>
                <td>{event.phone}</td>
                <td>{event.dateOfEvent}</td>
                <td>{event.seats}</td>
                <td>{event.discription}</td>
                <td>{event.address}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        event.status === "Confirmed" ? "#2c3e50" : "#7f8c8d",
                      color: "white",
                    }}
                  >
                    {event.status}
                  </span>
                </td>
                <td>
                  {event.estimatedPrice
                    ? `₹${event.estimatedPrice}`
                    : "Not Set"}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control mr-2"
                      value={editingPrice[event.id] || ""}
                      placeholder="Enter Price"
                      onChange={(e) =>
                        setEditingPrice((prev) => ({
                          ...prev,
                          [event.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-primary m-2"
                      onClick={() => handleUpdatePrice(event.id)}
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events to manage at the moment.</p>
      )}
    </div>
  );
};

export default ManageRegEvents;
