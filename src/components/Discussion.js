import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, ListGroup, Card } from 'react-bootstrap';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Discussion = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const navigate = useNavigate();

    const fetchEvent = useCallback(() => {
        axios.get(`http://127.0.0.1:8000/api/events/${eventId}`)
            .then(response => setEvent(response.data))
            .catch(error => console.error(error));
    }, [eventId]);

    const fetchComments = useCallback(() => {
        axios.get(`http://127.0.0.1:8000/api/events/${eventId}/comments`)
            .then(response => setComments(response.data))
            .catch(error => console.error(error));
    }, [eventId]);

    useEffect(() => {
        fetchEvent();
        fetchComments();
    }, [fetchEvent, fetchComments]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!userName) {
            alert('User name is required');
            return;
        }
        axios.post(`http://127.0.0.1:8000/api/events/${eventId}/comments`, { text: newComment, user_name: userName })
            .then(response => {
                setComments([...comments, response.data]);
                setNewComment('');
                setUserName('');
            })
            .catch(error => console.error(error));
    };

    const handleDeleteComment = (commentId) => {
        axios.delete(`http://127.0.0.1:8000/api/events/${eventId}/comments/${commentId}`)
            .then(() => {
                setComments(comments.filter(comment => comment.id !== commentId));
            })
            .catch(error => console.error(error));
    };

    const addEmoji = (emoji) => {
        setNewComment(newComment + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <Container className="my-5">
            {event && (
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>#{event.order_number} - {event.name}</Card.Title>
                        <Card.Text>
                            <strong>Description:</strong> {event.description}<br />
                            <strong>Location:</strong> {event.location}<br />
                            <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}<br />
                            <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}<br />
                            <strong>Status:</strong> {event.status}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <h2>Discussion</h2>
            <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group controlId="formUserName" className="mb-3">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formComment" className="mb-3">
                    <Form.Label>Add a Comment</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </Form.Group>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="light" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="me-2">
                        😀
                    </Button>
                    {showEmojiPicker && (
                        <Picker data={data} onEmojiSelect={addEmoji} />
                    )}
                </div>
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
            <ListGroup>
                {comments.map(comment => (
                    <ListGroup.Item key={comment.id}>
                        <strong>{comment.user_name}:</strong> {comment.text}
                        <Button variant="danger" onClick={() => handleDeleteComment(comment.id)} className="ms-3">
                            Delete
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
                Back
            </Button>
        </Container>
    );
};

export default Discussion;
