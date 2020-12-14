import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col} from 'react-bootstrap';

export default function EditSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [hourOpen, setHourOpen] = useState(props.info.hour_open);
    const [hourClose, setHourClose] = useState(props.info.hour_close);
    const [dayOpen, setDayOpen] = useState(props.info.day_open);
    const [dayClose, setDayClose] = useState(props.info.day_close);
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleScheduleInfo() {
        event.preventDefault();
        const salonInfo = {
            'hour_open': hourOpen,
            'hour_close': hourClose,
            'day_open': dayOpen,
            'day_close': dayClose,
        }

        api.editSchedule(salonInfo, props.info.id)
        .then(response => {
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Salon Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleScheduleInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            placeholder="Opening Hour"
                            onChange={(e) => {setHourOpen(String(e.target.value))}}
                            defaultValue={hourOpen}
                            required />
                        </Form.Group>
                        <Form.Text>am</Form.Text>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            placeholder="Closing Hour"
                            onChange={(e) => {setHourClose(String(e.target.value))}}
                            defaultValue={hourClose}
                            required />
                        </Form.Group>
                        <Form.Text>pm</Form.Text>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Text>From</Form.Text>
                            <Form.Control
                            as="select"
                            onChange={(e) => {setDayOpen(e.target.value)}}
                            defaultValue={dayOpen}
                            required>
                                {dayOfWeek.map((day, index) => {
                                    return <option key={index} value={day}>{day}</option>
                                    }
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Text>To</Form.Text>
                            <Form.Control
                            as="select"
                            onChange={(e) => {setDayClose(e.target.value)}}
                            defaultValue={dayClose}
                            required>
                                {dayOfWeek.map((day, index) => {
                                    return <option key={index} value={day}>{day}</option>
                                    }
                                )}
                            </Form.Control>
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
