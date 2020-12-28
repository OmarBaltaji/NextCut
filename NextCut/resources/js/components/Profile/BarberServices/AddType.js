import React, { useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';
import '../../../../css/Service.css';

export default function AddType(props) {
    const [openForm, setOpenForm] = useState(true);
    const [type, setType] = useState();

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function typeSubmitHandler() {
        event.preventDefault();

        const newType = {
            'type': type,
        }

        api.createService(newType)
        .then(response => {
            console.log(response);
            window.location.reload();
        });
    }

    return (
        <Modal centered show={openForm ? props.props : false} onHide={() => handleClose()} className="modal_2">
            <Modal.Header closeButton>
                <Modal.Title>Enter A Service Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={typeSubmitHandler}>
                    <Form.Row>
                        <InputGroup as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="Service Type"
                            onChange={(e) => {setType(e.target.value)}}
                            required />
                                <InputGroup.Append>
                                    <Button type="submit" variant="outline-secondary">
                                        Enter
                                    </Button>
                                </InputGroup.Append>
                        </InputGroup>
                    </Form.Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
