
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './AdminDashboard.css';



const ManagerDashboard = () => {
    const contextValue = {
        setResponseMessage: (message) => toast(message),
    };
    const headerStyle = {
                backgroundColor: '#343a40',
                color: 'white',
            };

    return (
        <div   className="admin-dashboard">
            <ToastContainer />

            <header style={headerStyle} className="header p-4">
                <h1 className="header-title">Manager Dashboard</h1>
                <nav className="navbar">
                    <Link to="ViewAssignedTask" className="nav-link">View Assigned Task</Link>
                    <Link to="AddEventImages" className="nav-link">Manage Event Images</Link>
                  
                   
                    <Link to="updatePasswordmanager" className="nav-link">Update Password</Link>
                    <Link to="/" className="nav-link logout">Logout</Link>
                </nav>
            </header>

            <main  className="main-content">
                <Outlet context={contextValue} />
            </main>
        </div>
    );
};

export default ManagerDashboard;

