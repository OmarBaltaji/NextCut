import React, { useEffect, useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import axios from 'axios';
import {Button, Form, InputGroup, Col, Card, Modal} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';

export default function EditProfile(props) {
    const [openForm, setOpenForm] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [name, setName] = useState(props.info.name);
    const [phoneNumber, setPhoneNumber] = useState(props.info.phone_number);
    const [email, setEmail] = useState(props.info.email);
    const [errs, setErrs] = useState([]);

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function editHandler(event) {
        event.preventDefault();
        const newInfo = {
            'name': name,
            'email': email,
            'phone_number': phoneNumber,
        };

        api.updateUserInfo(
            props.info.id, newInfo, {headers:{'Accept': "application/json", 'Content-Type':"application/json"}
            }).then(response => {
                handleClose();
                window.location.reload();
            }).catch(error => {
                setErrs(error.response.data.errors);
            });
    }

    function displayError (field) {
        if (errs[field]) {
            return (
                <span style={{ color: 'red', fontWeight:'bold' }}>
                    {errs[field]}
                </span>
            );
        }
    }

    return (
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Salon Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={editHandler}>
                {/* encType="multipart/form-data"> */}
                    <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                        type="text"
                        defaultValue={props.info.name}
                        onChange={(e) => {setName(e.target.value)}} />
                        {displayError('name')}
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                        type="email"
                        defaultValue={props.info.email}
                        onChange={(e) => {setEmail(e.target.value)}} />
                        {displayError('email')}
                    </Form.Group>
                    <Form.Group controlId="formGroupInput">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                        type="tel"
                        defaultValue={props.info.phone_number}
                        onChange={(e) => {setPhoneNumber(e.target.value)}} />
                        {displayError('phone_number')}
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
