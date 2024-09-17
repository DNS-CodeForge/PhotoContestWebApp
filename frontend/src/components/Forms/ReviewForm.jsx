import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import classes from './Form.module.css';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ReviewForm({ submissionId, onClose, onSubmitSuccess }) {
    const [score, setScore] = useState(1);
    const [comment, setComment] = useState('');
    const [categoryMismatch, setCategoryMismatch] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_BASE_URL}api/submission/${submissionId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    score: categoryMismatch ? 0 : score,
                    comment: categoryMismatch ? 'Category mismatch' : comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const data = await response.json();
            setLoading(false);
            onSubmitSuccess(data);
            onClose();
        } catch (err) {
            setLoading(false);
            setError('Error submitting review. Please try again.');
        }
    };

    const handleScoreChange = (e) => {
        const value = Math.min(Math.max(e.target.value, 1), 10);
        setScore(value);
    };

    const handleCategoryMismatchChange = () => {
        setCategoryMismatch(!categoryMismatch);
        if (!categoryMismatch) {
            setScore(0);
            setComment('Category mismatch');
        } else {
            setScore(1);
            setComment('');
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className={classes['form-box']}>
                <p>Submit Your Review</p>
                <form onSubmit={handleSubmit} className={classes['review-form']}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <label style={{ color: 'white', display: 'block', textAlign: 'left', marginBottom: '5px' }}>
                        Score (1-10)
                    </label>
                    <div className={classes['user-box']}>
                        <input
                            id="Score"
                            type="number"
                            min="1"
                            max="10"
                            value={score}
                            onChange={handleScoreChange}
                            disabled={categoryMismatch}
                            required
                        />
                    </div>

                    <label style={{ color: 'white', display: 'block', textAlign: 'left', marginBottom: '5px' }}>
                        Comment
                    </label>
                    <div className={classes['user-box']}>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            disabled={categoryMismatch}
                            required
                        />
                    </div>

                    <div className={classes['category-mismatch']}>
                        <label style={{ color: 'white', textAlign: 'left' }}>
                            <input
                                type="checkbox"
                                checked={categoryMismatch}
                                onChange={handleCategoryMismatchChange}
                            />
                            Category Mismatch
                        </label>
                    </div>

                    <button type="submit" className={classes['animated-button']} disabled={loading}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default ReviewForm;
