import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';
import Button from './Button';

const ProjectRating = ({ projectId, onRate, type = 'projects' }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/data/public/${type}/${projectId}/rate`, { rating, comment });
            if (onRate) onRate();
            alert('Rating submitted successfully!');
            setComment('');
            setRating(0);
        } catch (err) {
            console.error(err);
            alert('Failed to submit rating.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <h4>Rate this Project</h4>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                                style={{ display: 'none' }}
                            />
                            <FaStar
                                className="star"
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                size={25}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment..."
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px', marginBottom: '10px' }}
                />
                <Button type="submit" disabled={!rating || submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>
        </div>
    );
};

export default ProjectRating;
