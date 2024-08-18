import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function SignOut() {
    const { setUser } = useContext(UserContext);

    const handleSignOut = async () => {
        const response = await fetch('http://localhost:8000/api/signout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            setUser({
                username: '',
                is_authenticated: false,
                is_pending: false,
            });

            window.location.href = '/';
        } else {
            console.error('Failed to sign out');
        }
    };

    return handleSignOut;
}

export default SignOut;
