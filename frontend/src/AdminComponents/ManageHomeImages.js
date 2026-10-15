import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageHomeImages = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch all images from the backend
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    axios
      .get("http://localhost:8080/getAllImages")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("http://localhost:8080/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(response.data);
        fetchImages(); // Refresh the image list after successful upload
        setSelectedImage(null); // Reset input
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/deleteImage/${id}`);
        if (response.status === 200) {
          alert(response.data);
          fetchImages(); // Refresh the image list after successful deletion
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add or Delete Home Images</h2>

      {/* Image Upload Form */}
      <form onSubmit={handleImageUpload} className="mb-5">
        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">
            Select Image to Upload
          </label>
          <input
            type="file"
            className="form-control "
            id="imageUpload"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Upload Image
        </button>
      </form>

      {/* Display Uploaded Images */}
      <div className="row">
        {images.length > 0 ? (
          images.map((image) => (
            <div className="col-md-4 mb-4" key={image.id}>
              <div className="card shadow-sm">
                <img
                  src={`data:image/jpeg;base64,${image.image}`}
                  alt="Uploaded"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Image ID: {image.id}</h5>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No images available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageHomeImages;
