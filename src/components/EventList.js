import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import { Button, Container, ListGroup, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [deletedEvent, setDeletedEvent] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get('http://127.0.0.1:8000/api/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error(error));
    };

    const handleEventCreated = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    const handleDelete = (id) => {
        const eventToDelete = events.find(event => event.id === id);
        axios.delete(`http://127.0.0.1:8000/api/events/${id}`)
            .then(() => {
                setEvents(events.filter(event => event.id !== id));
                setDeletedEvent(eventToDelete);
            })
            .catch(error => console.error(error));
    };

    const handleSetAttendance = (id, status) => {
        axios.patch(`http://127.0.0.1:8000/api/events/${id}/attendance`, { status })
            .then(response => {
                setEvents(events.map(event => event.id === id ? response.data : event));
            })
            .catch(error => console.error(error));
    };

    const handleRestore = () => {
        if (deletedEvent) {
            axios.post('http://127.0.0.1:8000/api/events', deletedEvent)
                .then(response => {
                    setEvents([...events, response.data]);
                    setDeletedEvent(null);
                })
                .catch(error => console.error(error));
        }
    };

    const filteredEvents = events.filter(event => {
        if (filter === 'All') return true;
        return event.status === filter;
    });

    return (
        <Container className="my-5">
            <div className="form-container">
                <h1 className="text-center mb-5">Event Management</h1>
                <EventForm onEventCreated={handleEventCreated} />
            </div>
            <Form.Group controlId="formFilter" className="mb-3">
                <Form.Label>Filter by status:</Form.Label>
                <Form.Control as="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Attending">Attending</option>
                    <option value="Not Attending">Not Attending</option>
                </Form.Control>
            </Form.Group>
            <ListGroup className="mt-4">
                {filteredEvents.map(event => (
                    <ListGroup.Item key={event.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>#{event.order_number} - {event.name}</Card.Title>
                                <Card.Text>
                                    <strong>Description:</strong> {event.description}<br />
                                    <strong>Location:</strong> {event.location}<br />
                                    <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}<br />
                                    <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}<br />
                                    <strong>Status:</strong> {event.status}
                                </Card.Text>
                                <Button variant="success" onClick={() => handleSetAttendance(event.id, 'Attending')} className="me-2">Attending</Button>
                                <Button variant="warning" onClick={() => handleSetAttendance(event.id, 'Not Attending')} className="me-2">Not Attending</Button>
                                <Button variant="danger" onClick={() => handleDelete(event.id)}>Delete</Button>
                                <Link to={`/discussion/${event.id}`}>
                                    <Button variant="info" className="ms-2">Discussion</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            {deletedEvent && (
                <Button variant="secondary" onClick={handleRestore} className="mt-3">Back</Button>
            )}
        </Container>
    );
};

export default EventList;
