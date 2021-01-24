import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, InputGroup} from 'react-bootstrap';
import '../../../../css/Service.css'

export default function AddBarberService(props) {
    const [openForm, setOpenForm] = useState(true);
    const [type, setType] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newTime, setNewTime] = useState();
    const [newServiceType, setNewServiceType] = useState();
    const [services, setServices] = useState([]);
    const [allBarberServices, setAllBarberServices] = useState([]);
    const [serviceResponse, setServiceResponse] = useState([]);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        getServiceInfo();
        showBarberServices();
    }, [])

    const handleClose = () => {
        setOpenForm(false); // To be able to close the form after opening it
        props.setShow(false); // Setting Show to false to update it in the parent's component (Profile)
    }

    function BarberServiceSubmitHandler(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {  // Check whether all inputs are validated
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();

        setValidated(true); // To confirm that all fields are validated


        let isExist = false;  // Check if the service's type already exists

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

        api.createBarberService(info)
        .then(response => {
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
            setNewServiceType(response.data[0].id); //so the newServiceType is not null in case the user did not select any type
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
        <Modal centered show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header style={{ backgroundColor:'beige' }} closeButton>
                <Modal.Title style={{ color: '#DAA520' }}>Enter A new Service</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor:'beige' }} >
                <Form noValidate validated={validated} onSubmit={BarberServiceSubmitHandler}>
                    <Form.Row>
                        <Form.Label className="label">Price: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            className="service_input"
                            id="price"
                            placeholder="price"
                            onChange={(e) => setNewPrice(e.target.value)}
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
                            id="time"
                            placeholder="Estimated Time"
                            onChange={(e) => setNewTime(e.target.value)}
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
                            className="service_input"
                            as="select"
                            id="select_type"
                            onChange={(e) => handleSelectServiceType(e.target.value)}
                            required>
                                {services.map(service => {
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
                        Add
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
