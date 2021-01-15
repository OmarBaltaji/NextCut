import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, Row, InputGroup} from 'react-bootstrap';
import '../../../../css/Service.css'

export default function AddSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [type, setType] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newTime, setNewTime] = useState();
    const [newBarberService, setNewBarberService] = useState();
    const [services, setServices] = useState([]);
    const [allBarberServices, setAllBarberServices] = useState([]);
    const [serviceResponse, setServiceResponse] = useState([]);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        getServiceInfo();
        showBarberServices();
    }, [])

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function BarberServiceSubmitHandler(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();

        setValidated(true);


        let isExist = false;

        allBarberServices.forEach(barberService => {
            if(barberService.service.id == newBarberService) {
                alert('You Already Have This Service Type Included');
                isExist = true;
                document.getElementById('price').value = '';
                document.getElementById('time').value = '';
                document.getElementById('select_type').value = '';
                return;
            }
        })

        if(isExist == true) {
            return;
        }

        const info = {
            'price': newPrice,
            'estimated_time': newTime,
            'service_id': parseInt(newBarberService),
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
            console.log(response.data)
        })
    }

    function getServiceInfo() {
        api.getService()
        .then(response => {
            setServices(response.data);
            setNewBarberService(response.data[0].id); //so the newBarberService is not null in case the user did not select any type
        })
    }

    function handleSelectBarberService(value) {
        if(value == "Add Type") {

        } else {
            setNewBarberService(value);
        }
    }

    function typeSubmitHandler() {
        event.preventDefault();

        let isExist = false;

        services.forEach(service => {
            if(service.type === type) {
                isExist = true;
                alert('Type Already Exist');
                document.getElementById('add_type').value = '';
                return; //exit the loop
            }
        })

        if(isExist == true) {
            return; //exit the function
        }

        const newType = {
            'type': type,
        }

        api.createService(newType)
        .then(response => {
            setServiceResponse(response.data);
            let select = document.getElementById('select_type');
            let option = document.createElement('option');
            option.value = response.data.id;
            option.text = response.data.type;
            select.append(option);
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
                            onChange={(e) => handleSelectBarberService(e.target.value)}
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
