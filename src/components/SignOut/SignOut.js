import axios from '../../utils/axiosConfig';
import { fetchAndSetCsrfToken } from '../../utils/csrf';

const signOut = async (setUser) => {
    await fetchAndSetCsrfToken();
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
