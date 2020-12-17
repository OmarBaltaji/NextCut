import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col} from 'react-bootstrap';

export default function AddSchedule(props) {
    const [openForm, setOpenForm] = useState(true);
    const [hourOpen, setHourOpen] = useState('');
    const [hourClose, setHourClose] = useState('');
    const [dayOpen, setDayOpen] = useState('Monday');
    const [dayClose, setDayClose] = useState('');
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        document.getElementById('closing_day').value = '';
    }, [])

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

        api.createSchedule(salonInfo)
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
                <Form onSubmit={handleScheduleInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            placeholder="Opening Hour"
                            id="opening_hour"
                            onChange={(e) => {hourOpenHandler(e)}}
                            required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="time"
                            id='closing_hour'
                            placeholder="Closing Hour"
                            onChange={(e) => {hourCloseHandler(e)}}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Text>From</Form.Text>
                            <Form.Control
                            as="select"
                            onChange={(e) => {dayOpenHandler(e)}}
                            id='opening_day'
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
                            onChange={(e) => {dayCloseHandler(e)}}
                            id='closing_day'
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
