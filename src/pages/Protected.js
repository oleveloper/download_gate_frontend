import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastMessage from './ToastMessage';

function Protected() {
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const checkAccess = async () => {
            const response = await fetch('http://localhost:8000/api/protected-view/', {
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
