import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';
import '../../../../css/Service.css';

export default function EditBarberService(props) {
    const [openForm, setOpenForm] = useState(true);
    const [newPrice, setNewPrice] = useState(props.info.price);
    const [newTime, setNewTime] = useState(props.info.estimated_time);
    const [type, setType] = useState();
    const [validated, setValidated] = useState(false);
    const [services, setServices] = useState([]);
    const [serviceResponse, setServiceResponse] = useState([]);
    const [allBarberServices, setAllBarberServices] = useState([]);
    const [newServiceType, setNewServiceType] = useState(props.info.service.id);

    useEffect(() => {
        showBarberServices();
        getServiceInfo();
    }, [])

    const handleClose = () => {
        setOpenForm(false); // To be able to close the form after opening it
        props.setShow(false); // Setting Show to false to update it in the parent's component (Profile)
    }

    function handleBarberService(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) { // Check whether all inputs are validated
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();

        setValidated(true); // To confirm that all fields are validated

        let isExist = false; // Check if the service type already exists

        allBarberServices.forEach(barberService => {
            if(barberService.service.id == newServiceType) {
                alert("You Already Have This Service's Type Included");
                isExist = true;
                document.getElementById('price').value = '';
                document.getElementById('time').value = '';
                document.getElementById('select_type').value = ''; // To make all the fields blank again
                return; // Exit the loop
            }
        })

        if(isExist == true) { // If the service's type already exists, exit the function
            return;
        }

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

    function showBarberServices() {
        api.getBarberService()
        .then(response => {
            setAllBarberServices(response.data);
        })
    }

    function getServiceInfo() {
        api.getService()
        .then(response => {
            setServices(response.data);
        })
    }

    function handleSelectServiceType(value) {
        setNewServiceType(value);
    }

    function typeSubmitHandler() {
        event.preventDefault();

        let isExist = false; // Ensures that the service's type is not already included

        services.forEach(service => {
            if(service.type === type) {
                isExist = true;
                alert('Type Already Exist');
                document.getElementById('add_type').value = '';
                return; // Exit the loop
            }
        })

        if(isExist == true) {
            return; // Exit the function
        }

        const newType = {
            'type': type,
        }

        api.createService(newType)
        .then(response => {
            setServiceResponse(response.data); // To render the new addition immediately
            let select = document.getElementById('select_type');
            let option = document.createElement('option');
            option.value = response.data.id;
            option.text = response.data.type;
            select.append(option); // To instantly add the new type to the list of services' type
            document.getElementById('add_type').value = '';
            alert('New Service Type Added!');
        });
    }

    return(
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
                <Modal.Title style={{ color: '#DAA520' }}>Edit Service</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor:'beige' }}>
                <Form noValidate validated={validated} onSubmit={handleBarberService}>
                    <Form.Row>
                        <Form.Label className="label">Price: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            className="service_input"
                            type="number"
                            placeholder="price"
                            onChange={(e) => {setNewPrice(e.target.value)}}
                            defaultValue={props.info.price}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid price.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label className="label">Time: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            className="service_input"
                            placeholder="Estimated Time"
                            onChange={(e) => {setNewTime(e.target.value)}}
                            defaultValue={props.info.estimated_time}
                            required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid time.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <hr/>
                    <Form.Row className="type_row">
                        <Form.Label className="label">Type: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            as="select"
                            id="select_type"
                            className="service_input"
                            onChange={(e) => {handleSelectServiceType(e.target.value)}}
                            defaultValue={props.info.service.id}
                            required>
                                {props.services.map(service => {
                                    return (
                                        <option key={service.id} value={service.id}>
                                            {service.type}
                                        </option>
                                    )
                                })}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid type.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <InputGroup style={{ width:'60%', marginLeft:'10%' }}>
                            <Form.Control
                            className="service_input"
                            type="text"
                            id="add_type"
                            placeholder="Add New Service Type"
                            onChange={(e) => {setType(e.target.value)}}
                            />
                            <InputGroup.Append>
                                <Button className="service_btn" onClick={() => typeSubmitHandler()}>
                                    Add
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Row>
                    <Form.Text style={{ marginLeft:'10%' }} className="text-muted">
                        Can't find the type you want? Add one!
                    </Form.Text>
                    <br/>
                    <Button className="service_btn" type='submit'>
                        Edit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
