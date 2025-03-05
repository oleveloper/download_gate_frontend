import config from '../../config';

const signOut = async (setUser) => {
    const API_BASE_URL = config.API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/api/signout/`, {
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
    }
};

export default signOut;
