import React, { useEffect } from 'react';
import axios from 'axios';
import './Main.css';
import { Dashboard } from '../components';

const Main = () => {
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/')
            .then(response => {
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <h2><Dashboard/></h2>
    );
}

export default Main;
