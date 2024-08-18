import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Main.css';

const Main = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/files/')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="main-content">
            <h2>Dashboard</h2>
        </div>
    );
}

export default Main;
