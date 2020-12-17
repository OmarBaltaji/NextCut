import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col} from 'react-bootstrap';

export default function EditService(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newType, setNewType] = useState(props.info.type);

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleService() {
        event.preventDefault();
        const type = {
            'type': newType,
        }

        api.editService(type, props.info.id)
        .then(response => {
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Service Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleService}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control
                            type="text"
                            placeholder="Service Type"
                            onChange={(e) => {setNewType(e.target.value)}}
                            defaultValue={newType}
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
