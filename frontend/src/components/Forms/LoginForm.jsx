import { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginForm({ onClose }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

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
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken && data.refreshToken) {
                    localStorage.setItem('accessToken', data.accessToken);   // Used instead of cookie when no SSL/TLS is present
                    localStorage.setItem('refreshToken', data.refreshToken); // Used instead of cookie when no SSL/TLS is present
                    onClose();
                } else {
                    setErrorMessage('Login failed: Tokens not received.');
                }
            } else {
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Login</p>
                <Form method="post" onSubmit={handleSubmit}>
                    <div className={classes['user-box']}>
                        <input name="username" type="text" required />
                        <label>Username</label>
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
                    Don&apos;t have an account?{' '}
                    <a onClick={handleRegisterClick} className={classes['a2']}>
                        Sign up!
                    </a>
                </p>
            </div>
        </Modal>
    );
}

export default LoginForm;
