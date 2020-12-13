import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';

export default function AddSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [salon, setSalon] = useState('');
    const [hourOpen, setHourOpen] = useState('');
    const [hourClose, setHourClose] = useState('');
    const [dayOpen, setDayOpen] = useState('');
    const [dayClose, setDayClose] = useState('');
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleSalonInfo() {
        event.preventDefault();
        const salonInfo = {
            salon_name: salon,
            hour_open: hourOpen,
            hour_close: hourClose,
            day_open: dayOpen,
            day_close: dayClose,
        }

        api.createSalonInfo(salonInfo)
        .then(response => {
            console.log(response);
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Salon Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSalonInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            className = ''
                            placeholder="Salon Name"
                            onChange={(e) => {setSalon(e.target.value)}}
                            required
                            style={{ color: '#40E0D0' }} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            className = ''
                            placeholder="Opening Hour"
                            onChange={(e) => {setHourOpen(e.target.value)}}
                            required
                            style={{ color: '#40E0D0' }} />
                        </Form.Group>
                        <Form.Text>am</Form.Text>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            className = ''
                            placeholder="Closing Hour"
                            onChange={(e) => {setHourClose(e.target.value)}}
                            required
                            style={{ color: '#40E0D0' }} />
                        </Form.Group>
                        <Form.Text>pm</Form.Text>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            as="select"
                            className = ''
                            placeholder="From Day"
                            onChange={(e) => {setDayOpen(e.target.value)}}
                            required
                            style={{ color: '#40E0D0' }}>
                            {dayOfWeek.forEach(day => {
                                console.log(day)
                                return <option>{day}</option>
                                }
                            )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            as="select"
                            className = ''
                            placeholder="To Day"
                            onChange={(e) => {setDayClose(e.target.value)}}
                            required
                            style={{ color: '#40E0D0' }} />
                        </Form.Group>
                    </Form.Row>
                    <Button type='submit'>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
