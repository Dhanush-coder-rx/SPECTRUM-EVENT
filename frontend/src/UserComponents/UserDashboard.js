import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './AdminDashboard.css';
import { baseurl } from "../App";

const UserDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming user is logged in
    const navigate = useNavigate();

    const contextValue = {
        setResponseMessage: (message) => toast(message),
    };

    const headerStyle = {
        backgroundColor: '#343a40',
        color: 'white',
    };

    const handleLogout = async () => {
        try {
            const email = sessionStorage.getItem("email");

            const response = await fetch(`${baseurl}/logout/${email}`, {
                method: 'POST',
            });

            if (response.ok) {
                toast("Logged out successfully");
                setIsLoggedIn(false);
                navigate("/"); // Redirect to home or login page
            } else {
                toast.error("Failed to log out");
            }
        } catch (error) {
            toast.error("An error occurred while logging out");
        }
    };

    return (
        <div className="user-dashboard">
            <ToastContainer />

            <header style={headerStyle} className="header p-4">
                <h1 className="header-title">User Dashboard</h1>
                <nav className="navbar">
                    <Link to="BookEvent" className="nav-link">Book an event</Link>
                    <Link to="OurServices" className="nav-link">Our Services</Link>
                    <Link to="ViewRegisterEvents" className="nav-link">View Registered Events</Link>
                    <Link to="updatePassworduser" className="nav-link">Update Password</Link>
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="nav-link logout">
                            Logout
                        </button>
                    )}
                </nav>
            </header>

            <main className="main-content">
                <Outlet context={contextValue} />
            </main>
        </div>
    );
};

export default UserDashboard;
