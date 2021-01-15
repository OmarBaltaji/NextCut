import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';
import '../../../../css/Profile.css';

export default function AddSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [salon, setSalon] = useState('');
    const [hourOpen, setHourOpen] = useState('');
    const [hourClose, setHourClose] = useState('');
    const [dayOpen, setDayOpen] = useState('Monday');
    const [dayClose, setDayClose] = useState('');
    const [validated, setValidated] = useState(false);
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        document.getElementById('closing_day').value = '';
    }, [])

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleSalonInfo() {
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

        api.createSalonInfo(salonInfo)
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
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
            <Modal.Title style={{ color: '#DAA520' }}>Salon Info</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor:'beige' }}>
                <Form noValidate validated={validated} onSubmit={handleSalonInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            className="profile_input"
                            placeholder="Salon Name"
                            onChange={(e) => {setSalon(e.target.value)}}
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
                            className="profile_input"
                            placeholder="Opening Hour"
                            id='opening_hour'
                            onChange={(e) => {hourOpenHandler(e)}}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid hour.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            className="profile_input"
                            id="closing_hour"
                            placeholder="Closing Hour"
                            onChange={(e) => {hourCloseHandler(e)}}
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
                            id = 'opening_day'
                            onChange={(e) => {dayOpenHandler(e)}}
                            required>
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
                            onChange={(e) => {dayCloseHandler(e)}}
                            id = 'closing_day'
                            required>
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
