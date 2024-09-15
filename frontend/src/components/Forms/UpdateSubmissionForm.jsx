import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function SubmissionForm({ onClose, submission }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (submission) {
            setTitle(submission.title || '');
            setStory(submission.story || '');

            if (submission.photoUrl) {
                setPreview(submission.photoUrl);
            }
        }
    }, [submission]);

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

        if (!title || !story) {
            setErrorMessage('Please fill out both the title and story fields.');
            return;
        }

        const formData = new FormData();


        if (file) {
            formData.append('file', file);
        } else {
            formData.append('file', null);
        }

        const submissionData = {
            title: title,
            story: story,
        };

        formData.append('data', JSON.stringify(submissionData));

        try {
            setIsLoading(true);

            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(`${BACKEND_BASE_URL}api/submission/${submission.id}`, {
                method: 'PUT',
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
                <p>Edit Submission</p>
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
                        {isLoading ? 'Drawing...' : 'Edit'}
                    </button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </Modal>
    );
}
