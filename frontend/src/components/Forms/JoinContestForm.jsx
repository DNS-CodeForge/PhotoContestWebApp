import { useState } from 'react';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function JoinContestForm({ onClose, contestId }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setErrorMessage("Please upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(`${BACKEND_BASE_URL}api/contests/${contestId}/join`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Joined contest:', result);
                onClose();
            } else {
                setErrorMessage('Failed to join contest.');
            }
        } catch (error) {
            setErrorMessage('Error joining contest. Please try again later.');
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Join Contest</p>
                <form method="post" onSubmit={handleSubmit}>
                    <div className={classes['user-box']}>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                        <label>Upload Submission</label>
                    </div>
                    <button type="submit" className={classes['animated-button']}>
                        <span></span><span></span><span></span><span></span>
                        Submit
                    </button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </Modal>
    );
}
