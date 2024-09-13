import { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function RegisterForm({ onClose }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const registerDTO = {
            username: formData.get('username'),
            password: formData.get('password'),
            email: formData.get('email'),
        };

        try {
            const response = await fetch(`${BACKEND_BASE_URL}api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDTO),
                credentials: 'include',
            });

            if (response.ok) {
                onClose();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Registration failed');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Register</p>
                <Form method="post" onSubmit={handleSubmit}>

                    <div className={classes['user-box']}>
                        <input name="email" type="text" required />
                        <label>Email</label>
                    </div>

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
                    Have an account?{' '}
                    <a href="#" onClick={handleLoginClick} className={classes['a2']}>
                        Sign in!
                    </a>
                </p>
            </div>
        </Modal>
    );
}

export default RegisterForm;
