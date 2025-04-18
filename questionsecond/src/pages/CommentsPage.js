import React, { useEffect, useState } from 'react';

const CommentsPage = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/comments')
            .then(res => res.json())
            .then(data => setComments(data.comments));
    }, []);

    return (
        <div>
            <h2>Comments</h2>
            {comments.map(comment => (
                <div key={comment.id}>{comment.comment}</div>
            ))}
        </div>
    );
};

export default CommentsPage;
