import { useState } from 'react';
import { Form } from 'react-router-dom';
import Modal from '../Modal/Modal';
import classes from './LoginForm.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginForm({ onClose }) {
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const loginDTO = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            const response = await fetch(`${BACKEND_BASE_URL}api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDTO),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    onClose();
                } else {
                    setErrorMessage('Login failed: Token not received.');
                }
            } else {
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
      <Modal onClose={onClose}>
      <div className={classes['login-box']}>
        <p>Login</p>
        <Form method="post" onSubmit={handleSubmit}>
          <div className={classes['user-box']}>
            <input name="username" type="text" required />
            <label>Email</label>
          </div>
          <div className={classes['user-box']}>
            <input name="password" type="password" required />
            <label>Password</label>
          </div>
         <button type="submit" className={classes['animated-button']}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Submit
      </button>        
        </Form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <p>
          Don't have an account?{' '}
          <a href="#" className={classes['a2']}>
            Sign up!
          </a>
        </p>
      </div>
    </Modal>   
    );
}

export default LoginForm;
