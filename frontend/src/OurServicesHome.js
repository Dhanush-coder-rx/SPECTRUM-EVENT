


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./OurServices.css"; // Import custom styles

const OurServicesHome = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event types from the backend
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getEventTypes");
        if (response.status === 204) {
          setEventTypes([]); // No content
        } else {
          const enrichedEventTypes = await Promise.all(
            response.data.map(async (type) => {
              const imagesResponse = await axios.get(
                `http://localhost:8080/eventType/event-images/${type.id}`
              );
              return { ...type, images: imagesResponse.data };
            })
          );
          setEventTypes(enrichedEventTypes);
        }
      } catch (err) {
        setError("Failed to fetch event types.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div className="loading">Loading event types...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Render event types
  return (
    <div className="our-services-container">
      <h2 className="our-services-title">Our Services</h2>
      <div className="event-types-grid">
        {eventTypes.length > 0 ? (
          eventTypes.map((type) => {
            // Check if there are images before rendering the card
            if (type.images && type.images.length > 0) {
              return (
                <div key={type.id} className="event-type-card">
                  {/* Wrap the entire card with Link */}
                  <Link to="/register" className="event-type-link">
                    {/* Event Type Name */}
                    <h3 className="event-type-name">{type.eTypes}</h3>

                    {/* Image Slider */}
                    <div
                      id={`imageSlider-${type.id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {type.images.map((image, index) => {
                          console.log(image.imageBase64); // Log the base64 string for debugging
                          return (
                            <div
                              key={index}
                              className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >
                              <img
                                // Ensure the base64 string is prefixed correctly
                                src={`data:image/jpeg;base64,${image.imageBase64}`} 
                                className="d-block w-100"
                                alt={`Slide ${index + 1}`}
                                style={{
                                  height: "400px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Carousel Controls */}
                      {type.images.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#imageSlider-${type.id}`}
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#imageSlider-${type.id}`}
                            data-bs-slide="next"
                          >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              );
            }
            return null; // Don't render the card if there are no images
          })
        ) : (
          <div className="no-content">No event types available.</div>
        )}
      </div>
    </div>
  );
};

export default OurServicesHome;
