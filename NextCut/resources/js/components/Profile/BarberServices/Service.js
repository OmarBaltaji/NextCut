import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import api from '../../../api';
import Header from '../../Header';
import axios from 'axios';
import CookieService from '../../../Service/CookieService';
import {Col, Container, Row, Form, Button, Card, Table, InputGroup, ButtonGroup} from 'react-bootstrap';
import '../../../../css/Service.css';
import EditService from './EditService';
import EditBarberService from './EditBarberService';
import AddBarberService from './AddBarberService';

export default function Service() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [services, setServices] = useState([]);
    const [barberServices, setBarberServices] = useState([]);
    const [type, setType] = useState('');
    const [editService, setEditService] = useState();
    const [editBarberService, setEditBarberService] = useState();
    const servicesByBarber = localStorage.getItem('services_by_barber');

    const [showEditService, setShowEditService] = useState(false);
    const handleShowEditService = () => setShowEditService(true);

    const [showEditBarberService, setShowEditBarberService] = useState(false);
    const handleShowEditBarberService = () => setShowEditBarberService(true);

    const [showAddBarberService, setShowAddBarberService] = useState(false);
    const handleShowAddBarberService = () => setShowAddBarberService(true);

    useEffect(() => {
        showServices();
        showBarberServices();
    }, []);

    function showServices() {
        api.getService()
        .then(response => {
            setServices(response.data);
        })
    }

    function showBarberServices() {
        api.getBarberService()
        .then(response => {
            setBarberServices(response.data);
        })
    }

    function hanldeDeleteService(id) {
        let confirm_delete = confirm('Delete Service Type?');
        if (confirm_delete == true) {
            api.deleteService(id)
            .then(response => {
                window.location.reload();
            });
        }
    }

    function hanldeDeleteBarberService(id) {
        let confirm_delete = confirm('Delete Service?');
        if (confirm_delete == true) {
            api.deleteBarberService(id)
            .then(response => {
                window.location.reload();
            });
        }
    }

    function renderService() {
        return (
            <>
                {services.map((service, index) => {
                    return (
                        <tr key={service.id}>
                            <td>{index}</td>
                            <td>{service.type}</td>

 {/*see if the service belongs to the authenticated barber,if yes,
 then the barber can edit and delete the service types that belongs to him/her */}
                            {servicesByBarber.includes(service.id) ?
                                <td>
                                    <ButtonGroup>
                                        <Button
                                        onClick={() => {
                                        handleShowEditService();
                                        setEditService(service);
                                        }}>
                                            Edit
                                        </Button>
                                        <Button onClick={() => hanldeDeleteService(service.id)}>Delete</Button>
                                    </ButtonGroup>
                                </td>
                                : <td>{'Not Available'}</td>
                            }
                        </tr>
                        )
                })}
            </>
        );
    }

    function renderBarberService() {
        return (
            <>
                {barberServices.map((barberService, index) => {
                    return (
                        <tr key={barberService.id}>
                            <td>{index}</td>
                            <td>{barberService.service.type}</td>
                            <td>{barberService.price}</td>
                            <td>{barberService.estimated_time}</td>
                            <td>
                                <ButtonGroup>
                                    <Button
                                    onClick={() => {
                                    handleShowEditBarberService();
                                    setEditBarberService(barberService);
                                    }}>
                                        Edit
                                    </Button>
                                    <Button
                                    onClick={() => hanldeDeleteBarberService(barberService.id)}
                                    >Delete</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                        )
                })}
            </>
        );
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

    function displayEditService() {
        return(
            <EditService props={showEditService} info={editService} setShow={setShowEditService} />
        );
    }

    function displayBarberEditService() {
        return(
            <EditBarberService props={showEditBarberService} services={services} info={editBarberService} setShow={setShowEditBarberService} />
        );
    }

    function displayAddBarberService(showAddBarberService) {
        return(
            <AddBarberService props={showAddBarberService} setShow={setShowAddBarberService} />
        );
    }

    return (
        <>
            <Header/>
            <Container fluid>
                <div>
                <h2 style={{ textDecoration: 'underline' }}>Manage Your Services</h2>
                <Button onClick={() => handleShowAddBarberService()}
                style={{ position: 'relative', top: '15px'}}>
                    Add Services
                </Button>
                {showAddBarberService ? displayAddBarberService(showAddBarberService) : ''}
                </div>
                <br/>
                <Row>
                    <Col lg={8}>
                        <Table striped bordered hover className='service_table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Service Type</th>
                                    <th>Price</th>
                                    <th>Estimated Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {renderBarberService()}
                            </tbody>
                        </Table>
                        {showEditBarberService ? displayBarberEditService() : ''}
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Existing Services' Type</Card.Title>
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
                                <br/>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Service Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderService()}
                                    </tbody>
                                </Table>
                                {showEditService ? displayEditService() : ''}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
