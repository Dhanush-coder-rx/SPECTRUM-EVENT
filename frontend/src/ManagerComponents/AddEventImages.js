import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Form, Card, Row, Col, Modal, Image } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEventImages = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRegisterEventId, setSelectedRegisterEventId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewImagesTaskId, setViewImagesTaskId] = useState(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Ref for the file input
  const fileInputRef = useRef(null);

  const managerEmail = sessionStorage.getItem("email");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/events/manager/${managerEmail}`
        );

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          toast.error("Unexpected response data format.");
        }
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      }
    };

    fetchTasks();
  }, [managerEmail]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleRegisterEventChange = (event) => {
    const selectedEventId = event.target.value;
    setSelectedRegisterEventId(selectedEventId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    if (!selectedRegisterEventId) {
      toast.error("Please select a registered event.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      await axios.post(
        `http://localhost:8080/event-image/${selectedRegisterEventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Image uploaded successfully.");
      setSelectedImage(null);
      setSelectedRegisterEventId(""); // Reset the selected event

      // Clear the file input using the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload the image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewImages = async (eventId) => {
    try {
      // Make a GET request to fetch images based on eventId
      const response = await axios.get(`http://localhost:8080/event-images/${eventId}`);
      
      // Assuming the response contains an array of objects with `id` and `imageBase64`
      setImages(response.data); 
      
      setViewImagesTaskId(eventId);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch images.");
    }
  };
  

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:8080/event-image/${imageId}`);
      setImages(images.filter((image) => image.id !== imageId)); // Assuming each image has a unique `id`
      toast.success("Image deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">Upload Event Image</h2>

      <Form onSubmit={handleSubmit}>
        {/* Event selection dropdown */}
        <Form.Group controlId="selectRegisterEvent" className="mb-3">
          <Form.Label>Select Registered Event</Form.Label>
          <Form.Control
            as="select"
            value={selectedRegisterEventId}
            onChange={handleRegisterEventChange}
            required
          >
            <option value="">Select Event</option>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.eventType ? task.eventType.eTypes : "Unknown Event Type"} - {task.name}
                </option>
              ))
            ) : (
              <option value="">No events available</option>
            )}
          </Form.Control>
        </Form.Group>

        {/* Image selection input */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            required
          />
        </Form.Group>

        {/* Submit button */}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </Button>
      </Form>

      {/* Event Cards */}
      <h3 className="mt-5">Event Details</h3>
      <Row>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Col md={4} className="mb-4" key={task.id}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {task.eventType ? task.eventType.eTypes : "Unknown Event Type"}
                  </Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {task.name}
                    {/* <br />
                    <strong>Start Date:</strong> {task.startDate}
                    <br />
                    <strong>End Date:</strong> {task.endDate} */}
                  </Card.Text>
                  <Button
                    variant="info"
                    onClick={() => handleViewImages(task.id)}
                  >
                    View Images
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No events available to display.</p>
        )}
      </Row>

      {/* Modal for Viewing Images */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
  {images.length > 0 ? (
    images.map((image, index) => (
      <Col md={4} key={index} className="mb-3">
        <Card>
          <Image
            src={image.imageBase64} // Rendering the Base64 string as an image source
            alt={`Event Image ${index + 1}`}
            fluid
          />
          <Button
            variant="danger"
            className="mt-2"
            onClick={() => handleDeleteImage(image.id)} // Passing `id` for deletion
          >
            Delete
          </Button>
        </Card>
      </Col>
    ))
  ) : (
    <p>No images to display.</p>
  )}
</Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddEventImages;
