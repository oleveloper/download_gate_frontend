import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useContext(UserContext);
    return (
    <>
    { user && user.is_authenticated ? (
    <>
    <div>
        <h1 className="dashboard-header">Welcome back,
            <span className="dashboard-username"> {user.username}!</span>
        </h1>
    </div>
    <div className="dashboard">
        <div className="left-column">
            <div className="card">
                <div className="card-header">
                    <h2>Notice</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h2>Download History</h2>
                </div>
            </div>
        </div>

        <div className="right-column">
            <div className="card">
                <div className="card-header">
                    <h2>Schedule</h2>
                </div>
            </div>
        </div>
    </div>
    </>
    ) : 
    ( <div className="dashboard">
        <div className="left-column">
            <div className="card">
                <div className="card-header">
                    <h2>Notice</h2>
                </div>
            </div>
        </div>

        <div className="right-column">
            <div className="card">
                <div className="card-header">
                    <h2>Schedule</h2>
                </div>
            </div>
        </div>
    </div> ) }
    </>
    );
};

export default Dashboard;
