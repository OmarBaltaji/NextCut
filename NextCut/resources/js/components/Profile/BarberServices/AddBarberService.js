import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';

export default function AddSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newPrice, setNewPrice] = useState();
    const [newTime, setNewTime] = useState();
    const [newBarberService, setNewBarberService] = useState();
    const [services, setServices] = useState([]);

    useEffect(() => {
        getServiceInfo();
    }, [])

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function BarberServiceSubmitHandler() {
        event.preventDefault();
        const info = {
            'price': newPrice,
            'estimated_time': newTime,
            'service_id': parseInt(newBarberService),
        }

        api.createBarberService(info)
        .then(response => {
            console.log(response);
            window.location.reload();
        })
    }

    function getServiceInfo() {
        api.getService()
        .then(response => {
            setServices(response.data);
            setNewBarberService(response.data[0].id);
        })
    }


    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Enter A new Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={BarberServiceSubmitHandler}>
                    <Form.Row>
                        <Form.Label className="label">Price: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="price"
                            onChange={(e) => setNewPrice(e.target.value)}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label className="label">Time: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="Estimated Time"
                            onChange={(e) => setNewTime(e.target.value)}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="type_row">
                        <Form.Label>Type: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            as="select"
                            onChange={(e) => setNewBarberService(e.target.value)}
                            required>
                                {services.map(service => {
                                    return (
                                        <option key={service.id} value={service.id}>
                                            {service.type}
                                        </option>
                                    )
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Button type='submit'>
                        Enter
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
