import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col} from 'react-bootstrap';

export default function EditBarberService(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newPrice, setNewPrice] = useState(props.info.price);
    const [newTime, setNewTime] = useState(props.info.estimated_time);
    const [newServiceType, setNewServiceType] = useState(props.info.service.id);

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleBarberService() {
        event.preventDefault();
        const info = {
            'price': newPrice,
            'estimated_time': newTime,
            'service_id': parseInt(newServiceType),
        }

        api.editBarberService(info, props.info.id)
        .then(response => {
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleBarberService}>
                    <Form.Row>
                        <Form.Label className="label">Price: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="price"
                            onChange={(e) => {setNewPrice(e.target.value)}}
                            defaultValue={newPrice}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label className="label">Time: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="Estimated Time"
                            onChange={(e) => {setNewTime(e.target.value)}}
                            defaultValue={newTime}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="type_row">
                        <Form.Label>Type: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            as="select"
                            onChange={(e) => {setNewServiceType(e.target.value)}}
                            defaultValue={newServiceType}
                            required>
                                {props.services.map(service => {
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
