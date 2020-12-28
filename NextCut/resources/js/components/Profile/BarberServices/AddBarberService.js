import React, { useEffect, useState } from 'react';
import api from '../../../api';
import {Button, Form, Modal, Col, Row, InputGroup} from 'react-bootstrap';
import AddType from './AddType';
import '../../../../css/Service.css'

export default function AddSalon(props) {
    const [openForm, setOpenForm] = useState(true);
    const [type, setType] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newTime, setNewTime] = useState();
    const [newBarberService, setNewBarberService] = useState();
    const [services, setServices] = useState([]);
    const [serviceResponse, setServiceResponse] = useState([]);

    // const [showAddType, setShowAddType] = useState(false);
    // const handleShowAddType = () => setShowAddType(true);

    useEffect(() => {
        getServiceInfo();
        // document.getElementById('select_type').value = '';
    }, [])

    const handleClose = () => {
        setOpenForm(false); //to be able to close the form after opening it
        props.setShow(false); //setting Show to false to update it in the parent's component (Profile)
    }

    function BarberServiceSubmitHandler() {
        event.preventDefault();
        const info = {
            'price': newPrice,
            'estimated_time': newTime,
            'service_id': parseInt(newBarberService),
        }

        api.createBarberService(info)
        .then(response => {
            console.log(response);
            window.location.reload();
        })
    }

    function getServiceInfo() {
        api.getService()
        .then(response => {
            setServices(response.data);
            setNewBarberService(response.data[0].id);
        })
    }

    function handleSelectBarberService(value) {
        if(value == "Add Type") {
            // handleShowAddType();
        } else {
            setNewBarberService(value);
        }
    }

    // function displayAddType() {
    //     return(
    //         <AddType props={showAddType} setShow={setShowAddType} />
    //     );
    // }

    function typeSubmitHandler() {
        event.preventDefault();

        const newType = {
            'type': type,
        }

        api.createService(newType)
        .then(response => {
            setServiceResponse(response.data);
            console.log(response.data);
            let select = document.getElementById('select_type');
            let option = document.createElement('option');
            option.value = response.data.id;
            option.text = response.data.type;
            select.append(option);
        });
    }

    return(
        <Modal centered show={openForm ? props.props : false} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Enter A new Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={BarberServiceSubmitHandler}>
                    <Form.Row>
                        <Form.Label className="label">Price: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="price"
                            onChange={(e) => setNewPrice(e.target.value)}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label className="label">Time: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
                            type="number"
                            placeholder="Estimated Time"
                            onChange={(e) => setNewTime(e.target.value)}
                            required />
                        </Form.Group>
                    </Form.Row>
                    <hr/>
                    <Form.Row>
                        <InputGroup as={Col} style={{ display:'flex', alignItems: 'center' }}>
                            <Form.Label>Add New Type</Form.Label> &nbsp;&nbsp;
                            <Form.Control
                            type="text"
                            placeholder="Service Type"
                            onChange={(e) => {setType(e.target.value)}}
                            required />
                            <InputGroup.Append>
                                <Button onClick={() => typeSubmitHandler()} variant="outline-secondary">
                                    Enter
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Row>
                    <br/>
                    <Form.Row className="type_row">
                        <Form.Label>Type: </Form.Label> &nbsp;
                        <Form.Group as={Col}>
                            <Form.Control
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
                                {/* <option key={1000} value={"Add Type"}>+ Add Type</option> */}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    {/* {showAddType ? displayAddType(showAddType) : ''} */}
                    <Button type='submit'>
                        Enter
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
