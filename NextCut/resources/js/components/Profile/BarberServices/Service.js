import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import api from '../../../api';
import Header from '../../Header';
import {Col, Container, Row, Form, Button, Card, Table, InputGroup, ButtonGroup, Image} from 'react-bootstrap';
import '../../../../css/Service.css';
import EditBarberService from './EditBarberService';
import AddBarberService from './AddBarberService';

export default function Service() {
    const history = useHistory();
    const [services, setServices] = useState([]);
    const [barberServices, setBarberServices] = useState([]);

    const [editBarberService, setEditBarberService] = useState();

    const [showEditBarberService, setShowEditBarberService] = useState(false); // To close the popup window
    const handleShowEditBarberService = () => setShowEditBarberService(true); // To open the popup window

    const [showAddBarberService, setShowAddBarberService] = useState(false);
    const handleShowAddBarberService = () => setShowAddBarberService(true);

    const role = localStorage.getItem('role');

    useEffect(() => {
        getUserDetails();
        if(role) { // Ensure the user is barber before running the api calls
            showServices();
            showBarberServices();
        }
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            if(response.data.roles != 'Barber') {
                history.push('/home');
            }
        }).catch(error => {
            if(error.response.status == 401) {
                history.push('/home')
            }
        })
    }

    function showServices() { // To show services' type
        api.getService()
        .then(response => {
            setServices(response.data);
        })
    }

    function showBarberServices() { // Shows a list of services with their type, price and duration
        api.getBarberService()
        .then(response => {
            setBarberServices(response.data);
        })
    }

    function hanldeDeleteBarberService(id) { // Delete a service that a barber has inserted previously
        let confirm_delete = confirm('Delete Service?');
        if (confirm_delete == true) {
            api.deleteBarberService(id)
            .then(response => {
                window.location.reload();
            });
        }
    }

    function renderBarberService() { // Renders the services provided by the barber
        return (
            <>
                {barberServices.length != 0 ? barberServices.map((barberService, index) => {
                    return (
                        <tr key={barberService.id}>
                            <td className="service_thd">{index}</td>
                            <td className="service_thd">{barberService.service.type}</td>
                            <td className="service_thd">{barberService.price}</td>
                            <td className="service_thd">{barberService.estimated_time}</td>
                            <td>
                                <ButtonGroup>
                                    <Button
                                    onClick={() => {
                                    handleShowEditBarberService();
                                    setEditBarberService(barberService);}}
                                    className="service_btn">
                                        Edit
                                    </Button>
                                    <Button
                                    onClick={() => hanldeDeleteBarberService(barberService.id)}
                                    className="service_btn"
                                    style={{ borderLeft:'1px solid #00356f' }}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                        )
                }) : <tr><td colSpan="5" style={{ color:'#00356f' }}>Nothing Yet</td></tr>}
            </>
        );
    }

    function displayBarberEditService() { // Renders the popup window
        return(
            <EditBarberService props={showEditBarberService} services={services} info={editBarberService}
            setShow={setShowEditBarberService} />
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
            <br/>
            <Container fluid>
                <Button className="service_btn" style={{ marginBottom:'10px' }} href='/profile'>
                    <i className="fas fa-arrow-left" />
                </Button>
                <div>
                    <h2 style={{ color:'#DAA520' }}>Manage Your Services</h2>
                    <Button onClick={() => handleShowAddBarberService()}
                    style={{ position: 'relative', top: '10px'}}
                    className="service_btn">
                        Add Services
                    </Button>
                    {showAddBarberService ? displayAddBarberService(showAddBarberService) : ''}
                </div>
                <br/>
                <Row>
                    <Col lg={8}>
                        <div className='div_table'>
                            <Table responsive bordered hover className='service_table'>
                                <thead>
                                    <tr>
                                        <th className="service_thd">#</th>
                                        <th className="service_thd">Service Type</th>
                                        <th className="service_thd">Price</th>
                                        <th className="service_thd">Estimated Time</th>
                                        <th className="service_thd">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderBarberService()}
                                </tbody>
                            </Table>
                        </div>
                        {showEditBarberService ? displayBarberEditService() : ''}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
