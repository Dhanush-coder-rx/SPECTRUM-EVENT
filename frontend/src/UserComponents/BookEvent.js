import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseurl } from "../App";

const BookEvent = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventTypeId: "", // Will hold the selected event type ID
    description: "",
    address: "",
    dateOfEvent: "",
    seats: "",
   
  });

  const email = sessionStorage.getItem("email"); // Retrieve user email from session storage

  // Fetch event types
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    if (!email) {
      toast.error("User email is required. Please log in.");
      return;
    }
  
    if (!formData.name || !formData.eventTypeId || !formData.dateOfEvent) {
      toast.error("Please fill all required fields.");
      return;
    }
  
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        eventType: { id: formData.eventTypeId },
        discription: formData.description,
        address: formData.address,
        dateOfEvent: formData.dateOfEvent,
        seats: formData.seats,
      };
  
      // Send the request to register the event
      const response = await axios.post(
        `${baseurl}/registerEvent/${email}`,
        payload
      );
  
      // If event registration is successful, display success message
      toast.success("Event registered successfully.");
  
      // Reset the form data
      setFormData({
        name: "",
        phone: "",
        eventTypeId: "",
        description: "",
        address: "",
        dateOfEvent: "",
        seats: "",
      });
  
      // Now handle the email sending in the backend, check for errors
      const emailErrorMessage = response.data.includes("email failed");
      if (emailErrorMessage) {
        console.error("Failed to send email to admin:", emailErrorMessage);
        toast.error("Email failed to send to admin.");
      }
  
    } catch (error) {
      // Show a failure message if event registration fails
      toast.error(
        error.response?.data || "Event registration failed. Please try again."
      );
      console.error("Event registration failed:", error.message);
    }
  };
  
  

  return (
    <div className="container mt-5">
      <h2>Book an Event</h2>
      <div className="card p-3 mb-3">
        <form onSubmit={handleSubmit} >
          <div className="mb-3">
          <label htmlFor="name" className="form-label text-start">
              Event  Name <span className="text-danger">*</span>
        </label>

            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="eventTypeId" className="form-label">
              Event Type <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              id="eventTypeId"
              name="eventTypeId"
              value={formData.eventTypeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Event Type --</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.eTypes}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dateOfEvent" className="form-label">
              Date of Event <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="dateOfEvent"
              name="dateOfEvent"
              value={formData.dateOfEvent}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="seats" className="form-label">
              Number of Seats
            </label>
            <input
              type="number"
              className="form-control"
              id="seats"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
            />
          </div>

         

          <button type="submit" className="btn btn-primary m-3">
            Book Event
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookEvent;
