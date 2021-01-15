import React, { useEffect, useState } from 'react';
import api from '../../api';
import {Button, Form, InputGroup, Col, Card, Modal} from 'react-bootstrap';
import '../../../css/Profile.css';

export default function EditProfile(props) {
    const [openForm, setOpenForm] = useState(true);
    const [duplicateError, setDuplicateError] = useState();
    const [phoneNumber, setPhoneNumber] = useState(props.info.phone_number);
    const [errs, setErrs] = useState([]);

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function editHandler(event) {
        event.preventDefault();
        const newInfo = {
            'phone_number': String(phoneNumber),
        };

        api.updateUserInfo(
            props.info.id, newInfo, {headers:{'Accept': "application/json", 'Content-Type':"application/json"}
            }).then(response => {
                handleClose();
                window.location.reload();
            }).catch(error => {
                if(error.response.status == 500) {
                    setDuplicateError('Phone number already in use. Duplicate phone numbers cannot exist')
                } else {
                    setErrs(error.response.data.errors);
                }
            })
    }

    function displayError (field) {
        if (errs[field]) {
            return (
                <span style={{ color: '#980000' }}>
                    {errs[field]}
                </span>
            );
        }
    }

    return (
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
                <Modal.Title style={{ color: '#DAA520' }}>Profile Info</Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{ backgroundColor:'beige' }} >
                <Form onSubmit={editHandler}>
                {/* encType="multipart/form-data"> */}
                    <Form.Group controlId="formGroupInput">
                        <Form.Label className="profile_label">Phone Number</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="your mobile number"
                        className="profile_input"
                        defaultValue={props.info.phone_number}
                        onChange={(e) => {setPhoneNumber(e.target.value)}} />
                        {displayError('phone_number')}
                    </Form.Group>
                    <span style={{ color:'#980000', display:'block', marginBottom:'5px' }}>{duplicateError}</span>
                    <Button className="profile_btn" type="submit">
                        Update
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
