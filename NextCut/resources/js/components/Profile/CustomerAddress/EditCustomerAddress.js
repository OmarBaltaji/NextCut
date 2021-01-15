import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import {Button, Form, Modal, Col} from 'react-bootstrap';
import api from '../../../api';
import '../../../../css/Profile.css';

export default function AddAddress(props) {
    const [openForm, setOpenForm] = useState(true);
    const [city, setCity] = useState(props.info.city);
    const [street, setStreet] = useState(props.info.street);
    const [building, setBuilding] = useState(props.info.building);
    const [near, setNear] = useState(props.info.near);
    const [validated, setValidated] = useState(false);

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleAddressInfo() {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();
        setValidated(true);

        const customerAddressInfo = {
            'city': city,
            'street': street,
            'building': building,
            'near': near,
        }

        api.editCustomerAddress(customerAddressInfo, props.info.id)
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
                            value={city}
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
                            value={street}
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
                            placeholder="Building"
                            className="profile_input"
                            onChange={(e) => {setBuilding(e.target.value)}}
                            value={building}
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
                            value={near}
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
