import axios from '../../utils/axiosConfig';

const signOut = async (setUser) => {
    await axios.get('/api/csrf/');
    const response = await axios.post(
        "/api/signout/", {}, { withCredentials: true, });

    if (response.status === 200) {
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
