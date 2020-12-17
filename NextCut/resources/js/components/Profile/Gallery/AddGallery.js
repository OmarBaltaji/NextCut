import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import {Button, Form, Modal, Col} from 'react-bootstrap';
import api from '../../../api';

export default function AddAddress(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newImage, setNewImage] = useState('');


    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function handleAddressInfo() {
        event.preventDefault();

        const info = new FormData();
        info.append('image', newImage);

        api.createGallery(info, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}
        }).then(response => {
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
                <Form onSubmit={handleAddressInfo}
                encType="multipart/form-data">
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.File
                            label="Upload Image"
                            onChange={(e) => {setNewImage(e.target.files[0])}}
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
