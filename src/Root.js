import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import App from './App';

function Root() {
    return (
        <UserProvider>
            <Router>
                <App />
            </Router>
        </UserProvider>
    );
}

export default Root;
