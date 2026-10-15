import React, { useState } from 'react';
import axios from 'axios';
import { baseurl } from './App'; // Import baseurl
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${baseurl}/registerUser`, null, {
        params: {
          name,
          email,
          password,
        },
      });
  
      // Check the response
      if (response.data.includes("failed to send email")) {
        toast.warning("Registered successfully, but email failed to send. ");
      } else {
        toast.success("Registration Successful!");
      }
  
      // Navigate to /login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed! Please try again.");
    }
  };
  

  return (
    <div className="container d-flex justify-content-center " style={{marginTop:'130px'}}>
      <div className="card" style={{ width: '40rem', padding: '20px' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Register</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className='form-label' > Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
            <label className='form-label' > Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
            <label className='form-label' > Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
