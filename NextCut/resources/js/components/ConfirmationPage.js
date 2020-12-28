import React, { useEffect } from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import Header from './Header';
import { Col, Container, Row, Card, Table } from 'react-bootstrap';
import '../../css/ConfirmationPage.css';
import api from '../api';

export default function ConfirmationPage() {
    const history = useHistory();
    const location = useLocation();
    const date = location.state ? location.state.time_selected : '';
    const time = location.state ? location.state.time_selected[4].split(':') : '';
    const services = location.state ? location.state.chosen_services : '';

    function totalPrice() {
        let sum_price = 0;
        if(location.state) {
            services.forEach(service => {
                let service_array = service.split(',');
                sum_price += parseInt(service_array[0]);
            });
        }
        return sum_price;
    }

    function totalTime() {
        let sum_time = 0;
        if(location.state) {
            services.forEach(service => {
                let service_array = service.split(',');
                sum_time += parseInt(service_array[1]);
            })
        }
        return sum_time;
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            if(response.data.roles != 'Customer') {
                history.push('/home');
            } else if(response.data.roles == 'Customer') {
                if(!location.state) {
                    history.push('/booking');
                }
            }
        }).catch(error => {
            if(error.response.status == 401) {
                history.push('/home')
            }
        })
    }

    return (
        <>
            <Header/>
            <Container fluid>
                <Col lg={6}>
                    <Row>
                        <Card style={{ marginLeft:'10px' }}>
                            <Card.Header>
                                <h2>Your Booking Was A Success!</h2>
                            </Card.Header>
                            <Card.Body>
                            <Card.Title>Booking Information</Card.Title>
                                    <span>Barber: {location.state ? location.state.barber_name : ''}</span> <br/> <br/>
                                    <span>Payment Method: {location.state ? location.state.payment_method : ''}</span> <br/> <br/>
                                    <span>
                                        Appointment Date: {`${date[0]}, ${date[1]} ${date[2]} ${date[3]}`}
                                    </span> <br/> <br/>
                                    <span>
                                        Appointment Time: {`${time[0]}:${time[1]}`}
                                    </span> <br/> <br/>
                                    <span>Appointment Location: {location.state ? location.state.app_location : ''}</span> <br/> <br/>

                                <Table striped bordered size='md'>
                                    <thead>
                                        <tr>
                                            <th>Chosen Services</th>
                                            <th>Price</th>
                                            <th>Estimated Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {location.state ? services.map((service, index) => {
                                            let service_array = service.split(',');
                                            return (
                                                <tr key={index}>
                                                    <td>{service_array[3]}</td>
                                                    <td>{service_array[0]}$</td>
                                                    <td>{service_array[1]} mins</td>
                                                </tr>
                                            );
                                        }) : <tr><td></td></tr>}
                                    </tbody>
                                </Table>
                                <span>Total: {totalPrice() + '$'} & {totalTime() + ' mins'} </span>
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>
            </Container>
        </>
    );
}
