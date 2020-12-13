import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Header from './Header';
import CookieService from '../Service/CookieService';
import api from '../api';
import {Card, Col, Container, Row} from 'react-bootstrap';
import moment from 'moment';
import '../../css/Barber.css';

export default function ShowBarber(props) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const param = useParams();
    const [barberDetails, setBarberDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [addressDetails, setAddressDetails] = useState([]);
    const [services, setServices] = useState([]);
    const [barberService, setBarberService] = useState([]);
    const [openHours, setOpenHours] = useState([]);
    const [closeHours, setCloseHours] = useState([]);

    useEffect(() => {
        getBarberDetails();
        getServices();
    }, []);

    function getBarberDetails() {
        api.getOneBarber(param.id)
        .then(response => {
            setBarberDetails(response.data);
            setUserDetails(response.data.user);
            setAddressDetails(response.data.user.address[0]);
            setOpenHours(response.data.salon_open);
            setCloseHours(response.data.salon_close);
        });
    }

    function getServices() {
        api.getBarberServices(param.id)
        .then(response => {
            // console.log(response.data.barber_service);
            // console.log(response.data.service);
            setServices(response.data.service);
            setBarberService(response.data.barber_service);
        })
    }

    function displayBarberDetails() {
        return(
            <Container fluid>
                <Row>
                    <Col lg={4} sm>
                        <Card key={barberDetails.id}>
                            <Card.Img variant="top" src={`/Images/userImage/${userDetails.profile_photo}`}
                            height='350px' />
                            <Card.Body>
                                <Card.Title>{userDetails.name}</Card.Title>
                                <Card.Text>
                                    <span>Salon Name: {barberDetails.salon_name}</span> <br/>
                                    <span className="barber_header">Schedule</span> <br/>
                                    <span>From {barberDetails.day_open} to {barberDetails.day_close}: </span><br/>
                                    <span>Opening Hours: {barberDetails.hour_open}</span> <br/>
                                    <span>Closing Hours: {barberDetails.hour_close}</span> <br/>
                                    <span className="barber_header">Location</span> <br/>
                                    <span>City: {addressDetails.city}</span> <br/>
                                    <span>Street: {addressDetails.street}</span> <br/>
                                    <span>Building: {addressDetails.building}</span> <br/>
                                    <span>Near: {addressDetails.near}</span> <br/>
                                    <span className="barber_header">Contact</span> <br/>
                                    <span>Mobile: {userDetails.phone_number}</span>  <br/>
                                    <span>Email: {userDetails.email}</span>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">
                                    Joined: {moment(userDetails.created_at).format('DD/MM/YYYY')}
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="card_title">Services</Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <span className='service_header'>Type</span>
                                            {services.map(service =>
                                                <li key={service.id} className="service">
                                                    {service.type}
                                                </li>
                                            )}
                                        </Col>
                                        <Col>
                                            <span className='service_header'>Price</span>
                                            {barberService.map(service =>
                                                <li key={service.id} className="service">
                                                    {service.price}$
                                                </li>
                                            )}
                                        </Col>
                                        <Col>
                                            <span className='service_header'>Time</span>
                                            {barberService.map(service =>
                                                <li key={service.id} className="service">
                                                    {service.estimated_time} mins
                                                </li>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title  className="card_title">Private Schedule</Card.Title>
                                <Card.Text>

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <Header/>
            {displayBarberDetails()}
        </>
    );
}
