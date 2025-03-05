import React, { useState } from 'react';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = config.API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (username.length < 3) {
      setErrors(prevErrors => ({ ...prevErrors, username: 'Username must be at least 3 characters long.' }));
      return;
    }

    if (password.length < 8) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'Password must be at least 8 characters long.' }));
      return;
    }

    if (!termsAccepted) {
      setErrors(prevErrors => ({ ...prevErrors, terms: 'You must agree to the terms and policy.' }));
      return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/signup/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });

        const data = await response.json();
  
        if (response.ok) {
          navigate('/');
        } else {
          setErrors({ form: data.error });
        }
      } catch (error) {
        setErrors({ form: 'An unexpected error occurred' });
      }
    };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
          <div className="form-group terms">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span>I agree to the <a href="#">terms & policy</a></span>
            {errors.terms && <p className="error">{errors.terms}</p>}
          </div>
          <button type="submit" className="signup-button">Sign up</button>
          {success && <p className="success">{success}</p>}
        </form>
        {/* <div className="auth-options">
          <button className="google-signin">Sign up with Google</button>
          <button className="apple-signin">Sign up with Kakao</button>
        </div> */}
        <p className="signin-link" style={{textAlign: 'left'}}>
          <span style={{color: '#555'}}>Have an account?</span>
          <br/>
          <button className="signup-button" onClick={() => navigate('/signin')}>Sign in</button>
        </p>
      </div>
      <div className="signup-image">
        {/* <img src="" alt="Decorative" /> */}
      </div>
    </div>
  );
}

export default SignUp;
