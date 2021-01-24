import React, { useState } from 'react';
import {Button, Form, Modal, Col} from 'react-bootstrap';
import api from '../../../api';
import '../../../../css/Profile.css';

export default function AddAddress(props) {
    const [openForm, setOpenForm] = useState(true);
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [near, setNear] = useState('');
    const [validated, setValidated] = useState(false);

    const handleClose = () => {
        setOpenForm(false); // To be able to close the form after opening it
        props.setShow(false); // Setting Show to false to update it in the parent's component (Profile)
    }

    function handleAddressInfo(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {  // Check whether all inputs are validated
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();

        setValidated(true); // To confirm that all fields are validated

        const customerAddressInfo = {
            'city': city,
            'street': street,
            'building': building,
            'near': near,
        }

        api.createCustomerAddress(customerAddressInfo)
        .then(response => {
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
                <Modal.Title style={{ color: '#DAA520' }}>Salon Address</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor:'beige' }}>
                <Form noValidate validated={validated} onSubmit={handleAddressInfo}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="City"
                            className="profile_input"
                            onChange={(e) => {setCity(e.target.value)}}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            className="profile_input"
                            placeholder="Street"
                            onChange={(e) => {setStreet(e.target.value)}}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid street.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            className="profile_input"
                            placeholder="Building"
                            onChange={(e) => {setBuilding(e.target.value)}}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid building.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Control
                            placeholder="Near"
                            className="profile_input"
                            onChange={(e) => {setNear(e.target.value)}}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid input.
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
