import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome, FaInfoCircle, FaBriefcase, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo3.jpg';
import OurServicesHome from "./OurServicesHome";

const Home = () => {
  const [images, setImages] = useState([]);

  // Fetch images from backend API
  useEffect(() => {
    axios
      .get("http://localhost:8080/getAllImages")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  return (
    <div className="d-flex flex-column">
      {/* Top Navigation Menu */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="container-fluid">
      <a className="navbar-brand d-flex align-items-center text-center text-white" href="#home" style={{ marginLeft: '60px', opacity: '1' }}>
      <img src={logo} alt="Logo" style={{ width: '80px', height: '60px', borderRadius: '50%', marginRight: '10px' }} />
      <h2>SPECTRUM EVENT</h2>
          
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto" style={{ opacity: '1' }}>
            <li className="nav-item me-4">
              <a href="#home" className="nav-link text-white"><FaHome /> Home</a>
            </li>
            <li className="nav-item me-4">
              <a href="/login" className="nav-link text-white"><FaSignInAlt /> Login</a>
            </li>
            <li className="nav-item me-4">
              <a href="#works" className="nav-link text-white"><FaBriefcase /> Our Works</a>
            </li>
            <li className="nav-item me-4">
              <a href="/register" className="nav-link text-white"><FaUserPlus /> Register</a>
            </li>
            <li className="nav-item me-4">
              <a href="#about" className="nav-link text-white"><FaInfoCircle /> About Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>




      {/* Main Content */}
      <div className="flex-grow-1" >
        {/* Image Slider */}
        <div id="imageSlider" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
          {images.length > 0 ? (
  images.map((image, index) => (
    <div
      className={`carousel-item ${index === 0 ? "active" : ""}`}
      key={index}
    >
      <img
        src={`data:image/jpeg;base64,${image.image}`}
        className="d-block w-100"
        alt={`Slide ${index + 1}`}
        style={{ height: "800px", objectFit: "cover" }}
      />
    </div>
  ))
) : (
  <div className="carousel-item active">
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "500px" }}
    >
      {/* Spinner */}
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
)}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#imageSlider"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#imageSlider"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

<div id="works"><OurServicesHome/></div>
 

              {/* About Us Section */}
<div
  id="about"
  className="container my-5 p-5 text-white text-center"
  style={{
    background: "linear-gradient(to right, #4b79a1, #283e51)",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  }}
>
  <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "20px" }}>About Us</h3>
  <div className="row">
    <div className="col-md-3 mb-4">
      <div className="d-flex flex-column align-items-center">
        <i className="fa fa-map-marker fa-2x mb-3" style={{ color: "#ffcb6b" }}></i>
        <p className="mb-0">
          <strong>Visit us:</strong>
        </p>
        <p>Dharmasthala</p>
      </div>
    </div>
    <div className="col-md-3 mb-4">
      <div className="d-flex flex-column align-items-center">
        <i className="fa fa-phone fa-2x mb-3" style={{ color: "#ffcb6b" }}></i>
        <p className="mb-0">
          <strong>Contact us:</strong>
        </p>
        <p>+91 73385 30908</p>
      </div>
    </div>
    <div className="col-md-3 mb-4">
      <div className="d-flex flex-column align-items-center">
        <i className="fa fa-envelope fa-2x mb-3" style={{ color: "#ffcb6b" }}></i>
        <p className="mb-0">
          <strong>Email:</strong>
        </p>
        <p>spectrumdecors22@gmail.com</p>
      </div>
    </div>
   {/* Instagram */}
<div className="col-md-3 mb-4">
  <a
    href="https://www.instagram.com/spectrum_events"
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div
      className="d-flex flex-column align-items-center p-3"
     
    >
      <i
        className="fa fa-instagram fa-3x mb-3"
        style={{ color: "#ffcb6b" }}
      ></i>
      <h5 style={{ fontWeight: "bold" }}>Instagram</h5>
      <p>@spectrum_events</p>
    </div>
  </a>
</div>

    
  </div>
</div>





      </div>
    </div>
  );
};

export default Home;
