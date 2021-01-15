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
    const address = location.state ? location.state.customer_address : '';
    const app_location = location.state ? location.state.app_location : '';
    const building =
    address.length != 0 ? (address.building.includes('Building') ? address.building : address.building + ' Building') : '';
    const street =
    address.length != 0 ? (address.street.includes('Street') ? address.street : address.street + ' Street') : '';

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
            let services_str = '';
            services.forEach(service => {
                let service_array = service.split(',');
                services_str += service_array[3] + ', ';
            })

            let services_tosend = services_str.slice(0, services_str.length - 2);

            const info = {
                'email': response.data.email,
                'name': response.data.name,
                'barber_name': location.state.barber_name,
                'app_date': `${date[0]}, ${date[1]} ${date[2]} ${date[3]}`,
                'app_time': `${time[0]}:${time[1]}`,
                'app_location': app_location,
                'services': services_tosend,
                'total': totalPrice() + '$ & ' + totalTime() + ' mins',
            }

            api.sendMailConfirmation(info)
            .then(response => {
                console.log(response.data);
            });

        }).catch(error => {
            // if(error.response.status == 401) {
                // history.push('/home')
            // }
        })
    }

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

    return (
        <>
            <Header/>
            <br/>
            <Container fluid>
                <Col lg={12}>
                    <Row>
                        <Card style={{ margin:'auto', backgroundColor: 'beige' }}>
                            <Card.Header>
                                <h2 style={{ color:'#DAA520' }}>Appointment Successfully Booked</h2>
                            </Card.Header>
                            <Card.Body>
                            <Card.Title className="confirmed_subheaders">Booking Information</Card.Title>
                                    <span className="booking_info">
                                        <u>Barber:</u> {location.state ? location.state.barber_name : ''}
                                    </span> <br/>
                                    <span className="booking_info">
                                        <u>Payment Method:</u> {location.state ? location.state.payment_method : ''}
                                    </span> <br/>
                                    <span className="booking_info">
                                        <u>Appointment Date:</u> {`${date[0]}, ${date[1]} ${date[2]} ${date[3]}`}
                                    </span> <br/>
                                    <span className="booking_info">
                                        <u>Appointment Time:</u> {`${time[0]}:${time[1]}`}
                                    </span> <br/>
                                    <span className="booking_info">
                                        <u>Appointment Location:</u> {location.state ? location.state.app_location : ''}
                                    </span> <br/>

                                    {location.state.customer_address.length != 0 && location.state.app_location == 'Home' ?
                                    <span className="booking_info">
                                        <u>Your Address:</u> {`${address.city}, ${street}, ${building}, ${address.near}`}
                                        </span>
                                    : ''}

                                <Table bordered size='md' className="confirmed_table">
                                    <thead>
                                        <tr>
                                            <th className="confirmed_subheaders">Chosen Services</th>
                                            <th className="confirmed_subheaders">Price</th>
                                            <th className="confirmed_subheaders">Estimated Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {location.state ? services.map((service, index) => {
                                            let service_array = service.split(',');
                                            return (
                                                <tr key={index}>
                                                    <td className="confirmed_subheaders">{service_array[3]}</td>
                                                    <td className="confirmed_subheaders">{service_array[0]}$</td>
                                                    <td className="confirmed_subheaders">{service_array[1]} mins</td>
                                                </tr>
                                            );
                                        }) : <tr><td></td></tr>}
                                    </tbody>
                                </Table>
                                <span className="confirmed_subheaders">
                                    <strong style={{ textDecoration:'underline' }}>Total:</strong>&nbsp;
                                    {totalPrice() + '$'} & {totalTime() + ' mins'}
                                </span>
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>
            </Container>
        </>
    );
}
