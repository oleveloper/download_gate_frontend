import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axios from '../../utils/axiosConfig';
import { fetchAndSetCsrfToken } from '../../utils/csrf';
import './SignIn.css';

function SignIn() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await fetchAndSetCsrfToken();
      const response = await axios.post(
        "/api/signin/", {
          email: email,
          password: password,
        });

      const data = response.data;
      if (response.status === 200) {
        setUser({
          username: data.username,
          is_authenticated: data.is_authenticated,
          is_pending: data.is_pending,
        });
        navigate('/');
      } else {
        setErrors({ form: data.error });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="signin-button">Sign In</button>
          {errors.form && <p className="error">{errors.form}</p>}
        </form>
      </div>
      <div className="signin-image">
      </div>
    </div>
  );
}

export default SignIn;
