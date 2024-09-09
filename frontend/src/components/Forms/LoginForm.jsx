import { useState } from 'react';
import { Form } from 'react-router-dom';
import Modal from '../Modal/Modal';
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
            <h2>Login</h2>
            <Form method="post" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <br />
                <button type="submit">Login</button>
            </Form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Modal>
    );
}

export default LoginForm;
