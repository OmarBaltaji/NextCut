import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import {Button, Form, Modal, Col} from 'react-bootstrap';
import api from '../../../api';

export default function AddAddress(props) {
    const [openForm, setOpenForm] = useState(true);
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [near, setNear] = useState('');

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleAddressInfo() {
        event.preventDefault();
        const addressInfo = {
            'city': city,
            'street': street,
            'building': building,
            'near': near,
        }

        api.createAddress(addressInfo)
        .then(response => {
            console.log(response);
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Salon Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddressInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="City"
                            onChange={(e) => {setCity(e.target.value)}}
                            required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="Street"
                            onChange={(e) => {setStreet(e.target.value)}}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="Building"
                            onChange={(e) => {setBuilding(e.target.value)}}
                            required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            placeholder="Near"
                            onChange={(e) => {setNear(e.target.value)}}
                            required />
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
