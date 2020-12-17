import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';

export default function EditSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [salon, setSalon] = useState(props.info.salon_name);
    const [hourOpen, setHourOpen] = useState(props.info.hour_open);
    const [hourClose, setHourClose] = useState(props.info.hour_close);
    const [dayOpen, setDayOpen] = useState(props.info.day_open);
    const [dayClose, setDayClose] = useState(props.info.day_close);
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleSalonInfo() {
        event.preventDefault();
        const salonInfo = {
            'salon_name': salon,
            'hour_open': hourOpen,
            'hour_close': hourClose,
            'day_open': dayOpen,
            'day_close': dayClose,
        }

        api.editSalonInfo(salonInfo, props.info.id)
        .then(response => {
            handleClose();
            window.location.reload();
        })
    }

    function hourOpenHandler(e) {
        if((e.target.value != hourClose) && (e.target.value < hourClose) || hourClose == '')
            setHourOpen(String(e.target.value));
        else {
            alert('Closing Hours needs to be later than Opening Hours');
            document.getElementById('opening_hour').value = '';
        }
    }

    function hourCloseHandler(e) {
        if((e.target.value != hourOpen) && (e.target.value > hourOpen))
            setHourClose(String(e.target.value));
        else {
            alert('Closing Hours needs to be later than Opening Hours');
            document.getElementById('closing_hour').value = '';
        }
    }

    function dayOpenHandler(e) {
        let openIndex = dayOfWeek.indexOf(e.target.value);
        let closeIndex = dayOfWeek.indexOf(dayClose);
        if((openIndex != closeIndex && openIndex < closeIndex) || dayClose == '')
            setDayOpen(e.target.value)
        else {
            alert('Closing days needs to be later than Opening days');
            document.getElementById('opening_day').value = '';
            setDayOpen('');
        }
    }

    function dayCloseHandler(e) {
        let openIndex = dayOfWeek.indexOf(dayOpen);
        let closeIndex = dayOfWeek.indexOf(e.target.value);
        if((openIndex != closeIndex && openIndex < closeIndex))
            setDayClose(e.target.value)
        else {
            alert('Closing days needs to be later than Opening days');
            document.getElementById('closing_day').value = '';
            setDayClose('');
        }
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
                            placeholder="Salon Name"
                            onChange={(e) => {setSalon(e.target.value)}}
                            defaultValue={salon}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            id='opening_hour'
                            placeholder="Opening Hour"
                            onChange={(e) => {hourOpenHandler(e)}}
                            defaultValue={hourOpen}
                            required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            id='closing_hour'
                            placeholder="Closing Hour"
                            onChange={(e) => {hourCloseHandler(e)}}
                            defaultValue={hourClose}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Text>From</Form.Text>
                            <Form.Control
                            as="select"
                            id = "opening_day"
                            onChange={(e) => {dayOpenHandler(e)}}
                            defaultValue={props.info.day_open}
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
                            id='closing_day'
                            onChange={(e) => {dayCloseHandler(e)}}
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
