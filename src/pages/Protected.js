import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastMessage from './ToastMessage';
import config from '../../config';

function Protected() {
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const API_BASE_URL = config.API_BASE_URL;

    useEffect(() => {
        const checkAccess = async () => {
            const response = await fetch(`${API_BASE_URL}/api/protected-view/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 403) {
                const data = await response.json();
                setErrorMessage(data.error);
                history.push('/');
            }
        };

        checkAccess();
    }, [history]);

    return (
        <div>
            <h1>Protected Content</h1>
            {errorMessage && <ToastMessage message={errorMessage} />}
        </div>
    );
}

export default Protected;
