import { useState } from 'react';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function SubmissionForm({ onClose, contestId }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file || !title || !story) {
            setErrorMessage('Please fill out all fields and upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const submissionData = {
            title: title,
            story: story,
        };

        formData.append('data', JSON.stringify(submissionData));

        try {
            setIsLoading(true);

            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(`${BACKEND_BASE_URL}api/contest/${contestId}/submission`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                onClose();
                window.location.reload();
            } else {
                setErrorMessage('Failed to submit. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Error submitting. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Enter Submission</p>
                <form method="post" onSubmit={handleSubmit}>
                    <div className={classes['user-box']}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <label>Title</label>
                    </div>
                    <label className={classes.label}>Story</label>
                    <div className={classes['user-box']}>
                        <textarea
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            required
                        />
                    </div>


                    <div className={classes['file-upload-box']}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="file-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload" className={classes['custom-file-upload']}>
                            <span></span><span></span><span></span><span></span>
                            Choose Photo
                        </label>
                        {preview && <img src={preview} alt="Preview" className={classes['image-preview']} />}
                    </div>


                    <button
                        type="submit"
                        className={`${classes['animated-button']} ${isLoading ? classes['disabled-button'] : ''}`}
                        disabled={isLoading}
                    >
                        <span></span><span></span><span></span><span></span>
                        {isLoading ? 'Drawing...' : 'Submit'}
                    </button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </Modal>
    );
}
