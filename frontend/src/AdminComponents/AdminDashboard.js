import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeUsersCount, setActiveUsersCount] = useState(0);

    // Fetch active users count from backend
    useEffect(() => {
        const fetchActiveUsersCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/active-users-count'); // Update the URL if necessary
                if (response.ok) {
                    const count = await response.json();
                    setActiveUsersCount(count);
                } else {
                    throw new Error('Failed to fetch active users count');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching active users count');
            }
        };

        fetchActiveUsersCount();
    }, []);

    const contextValue = {
        setResponseMessage: (message) => toast(message),
    };

    const headerStyle = {
        backgroundColor: '#343a40',
        color: 'white',
    };

    return (
        <div className="admin-dashboard">
            <ToastContainer />

            <header style={headerStyle} className="header p-4">
            <h1 className="header-title">
        Admin Dashboard <br /> Active Users - {activeUsersCount}
    </h1>
                <nav className="navbar">
                    <Link to="manageRegEvents" className="nav-link">Manage Reg Events</Link>
                    <Link to="AssignEvents" className="nav-link">Assign Events</Link>
                    <Link to="viewAssignedEvents" className="nav-link">View Assigned Events</Link>
                    <Link to="manageManager" className="nav-link">Manage Manager</Link>
                    <Link to="manageEventsType" className="nav-link">Manage EventsType</Link>
                    <Link to="manageHomeImages" className="nav-link">Manage Home Images</Link>
                    <Link to="updatePassword" className="nav-link">Update Password</Link>
                    <Link to="/" className="nav-link logout">Logout</Link>
                </nav>
            </header>

            <main className="main-content">
                <Outlet context={contextValue} />
            </main>
        </div>
    );
};

export default AdminDashboard;
