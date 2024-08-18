import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserMenu = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/api/user/')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                setUser(null);
            });
    }, []);

    return (
        <div className="user-menu">
            {user ? (
                <div className="user-info">
                    <img src={user.profile_picture} alt="Profile" className="profile-picture" />
                    <span>{user.username}</span>
                </div>
            ) : (
                <a href="/signup" className="signup-link">Sign Up</a>
            )}
        </div>
    );
};

export default UserMenu;