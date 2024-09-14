import { useState } from 'react';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function UpdateSubmissionForm({ onClose, submissionId }) {
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

            const response = await fetch(`${BACKEND_BASE_URL}api/submissions/${submissionId}/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Submission updated:', result);
                onClose();
            } else {
                setErrorMessage('Failed to update submission.');
            }
        } catch (error) {
            setErrorMessage('Error updating submission. Please try again later.');
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Update Submission</p>
                <form method="post" onSubmit={handleSubmit}>
                    <div className={classes['user-box']}>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                        <label>Upload New Submission</label>
                    </div>
                    <button type="submit" className={classes['animated-button']}>
                        <span></span><span></span><span></span><span></span>
                        Update
                    </button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </Modal>
    );
}
