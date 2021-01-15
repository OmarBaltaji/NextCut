import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';
import '../../../../css/Profile.css';
import { validate } from 'uuid';

export default function EditSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [salon, setSalon] = useState(props.info.salon_name);
    const [hourOpen, setHourOpen] = useState(props.info.hour_open);
    const [hourClose, setHourClose] = useState(props.info.hour_close);
    const [dayOpen, setDayOpen] = useState(props.info.day_open);
    const [dayClose, setDayClose] = useState(props.info.day_close);
    const [validated, setValidated] = useState(false);
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleSalonInfo(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();
        setValidated(true);

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
            setHourOpen('');
        }
    }

    function hourCloseHandler(e) {
        if((e.target.value != hourOpen) && (e.target.value > hourOpen))
            setHourClose(String(e.target.value));
        else {
            alert('Closing Hours needs to be later than Opening Hours');
            document.getElementById('closing_hour').value = '';
            setHourClose('');
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
            <Modal.Header  style={{ backgroundColor:'beige' }} closeButton>
            <Modal.Title style={{ color: '#DAA520' }}>Salon Info</Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{ backgroundColor:'beige' }}>
                <Form noValidate validated={validated} onSubmit={handleSalonInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            className="profile_input"
                            placeholder="Salon Name"
                            onChange={(e) => {setSalon(e.target.value)}}
                            defaultValue={salon}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            id='opening_hour'
                            className="profile_input"
                            placeholder="Opening Hour"
                            onChange={(e) => {hourOpenHandler(e)}}
                            defaultValue={hourOpen}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid hour.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            id='closing_hour'
                            className="profile_input"
                            placeholder="Closing Hour"
                            onChange={(e) => {hourCloseHandler(e)}}
                            defaultValue={hourClose}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid hour.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Text style={{ color:'#00356f' }}>From</Form.Text>
                            <Form.Control
                            as="select"
                            className="profile_input"
                            id = "opening_day"
                            onChange={(e) => {dayOpenHandler(e)}}
                            defaultValue={props.info.day_open}
                            required >
                                {dayOfWeek.map((day, index) => {
                                    return <option key={index} value={day}>{day}</option>
                                    }
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid day.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Text style={{ color:'#00356f' }}>To</Form.Text>
                            <Form.Control
                            as="select"
                            className="profile_input"
                            id='closing_day'
                            onChange={(e) => {dayCloseHandler(e)}}
                            defaultValue={dayClose}
                            required >
                                {dayOfWeek.map((day, index) => {
                                    return <option key={index} value={day}>{day}</option>
                                    }
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid day.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Button className="profile_btn" type='submit'>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
