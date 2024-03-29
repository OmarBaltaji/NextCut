import React, { useState } from 'react';
import {Button, Form, Modal, Col} from 'react-bootstrap';
import api from '../../../api';
import '../../../../css/Profile.css';

export default function AddGallery(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newImage, setNewImage] = useState('');


    const handleClose = () => {
        setOpenForm(false); // To be able to close the form after opening it
        props.setShow(false); // Setting Show to false to update it in the parent's component (Profile)
    }

    function handleGalleryInfo() {
        event.preventDefault();

        const info = new FormData();
        info.append('image', newImage);

        api.createGallery(info, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}
        }).then(response => {
            handleClose();
            window.location.reload();
        })
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
                <Modal.Title style={{ color: '#DAA520' }}>Upload Image</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor:'beige' }}>
                <Form onSubmit={handleGalleryInfo}
                encType="multipart/form-data">
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.File
                            onChange={(e) => {setNewImage(e.target.files[0])}}
                            required />
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
