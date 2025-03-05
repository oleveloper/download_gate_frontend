import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Main.css';
import { Dashboard } from '../components';
import { useSnackbar } from 'notistack';
import config from '../config';

const Main = () => {
    const API_BASE_URL = config.API_BASE_URL;
    const [data, setData] = useState({ release_schedule: [], announcements: [] });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                enqueueSnackbar("There was an error fetching the data: " + error, { varient: 'error' })
            });
    }, []);

    return (
        <h2>
            <Dashboard
                releaseSchedule={data.release_schedule} 
                announcements={data.announcements} 
            />
        </h2>
    );
}

export default Main;
