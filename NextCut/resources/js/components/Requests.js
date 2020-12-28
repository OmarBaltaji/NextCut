import React, {useState, useEffect} from 'react';
import Header from './Header';
import {Container, Table, Form} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import api from '../api';
import moment from 'moment';
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { error } from 'jquery';

export default function Requests() {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [changedRequestStatus, setChangedRequestStatus] = useState([]);
    const history = useHistory();
    const localizer = momentLocalizer(moment);
    let myEventsList = [];

    if(bookingDetails.length != 0) {
        bookingDetails.forEach(detail => {
           let time_ends = parseInt(detail.time_booked.split(':')[0]) + Math.round((detail.total_time)/60);
            myEventsList.push(
                    {
                        title: detail.service_request[0].customer.user.name,
                        start: new Date(`${detail.date_booked} ${detail.time_booked}:00 GMT+0200 (Eastern European Standard Time)`),
                        end: new Date(`${detail.date_booked} ${time_ends}:00:00 GMT+0200 (Eastern European Standard Time)`),
                    }
                );
        })
    }

    useEffect(() => {
        getBookingDetails();
        getUserDetails();
    }, [changedRequestStatus]);

    function getBookingDetails() {
        api.getRequestDetails()
        .then(response => {
            console.log(response.data)
            setBookingDetails(response.data);
        });
    }

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

    function displayState(state) {
        switch(state) {
            case 1:
                return "accepted";
            case 2:
                return "rejected";
            default:
                return "pending";
        }
    }

    function displayIfCompleted(complete) {
        switch(complete) {
        case 1:
                return "Complete"
        default:
                return "Incomplete"
        }
    }

    function changeStatus(e, request_id) {
        let info;
        if(e.target.checked) {
            info = {
                completed: 1, //the request has been completed
                customer_request_id: request_id,
                state: 1, //this means the request was accepted
            };
        } else {
            info = {
                completed: 0,
                customer_request_id: request_id,
                state: 0,
            };
        }

        api.alterStatus(info)
        .then(response => {
            setChangedRequestStatus(response.data);
        });
    }

    function displayIncompletedBookingDetails() {
        return (
            <>
                {bookingDetails.length != 0 ?
                bookingDetails.map((detail, index) => {
                   if(detail.completed == 0) {
                        return (
                        <tr key={detail.id}>
                                <td>{index}</td>
                                <td>{detail.service_request[0].customer.user.name}</td>
                                <td>{detail.service_request[0].customer.user.phone_number}</td>
                                <td>{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td style={{ width:'13%' }}>{detail.date_booked} <br/> {' at ' + detail.time_booked}</td>
                                <td>{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td style={{ width:'7%' }}>{detail.appointment_location}</td>
                                <td style={{ width:'10%' }}>
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                                <td>{displayState(detail.state)}</td>
                                <td>
                                {displayIfCompleted(detail.completed)}
                                    <Form.Check
                                    style={{ textAlign:'center' }}
                                    onChange={(e) => changeStatus(e, detail.id)}
                                    defaultChecked={detail.completed} size='sm' type='checkbox' />
                                </td>
                        </tr>
                        )
                    }
                })
                :
                <tr>
                    <td colSpan="10">No Request As of Yet</td>
                </tr>}
            </>
        );
    }

    function displayCompletedBookingDetails() {
        return (
            <>
                {bookingDetails.length != 0 ?
                bookingDetails.map((detail, index) => {
                   if(detail.completed != 0) {
                        return (
                        <tr key={detail.id}>
                                <td>{index}</td>
                                <td>{detail.service_request[0].customer.user.name}</td>
                                <td>{detail.service_request[0].customer.user.phone_number}</td>
                                <td>{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td style={{ width:'13%' }}>{detail.date_booked} <br/> {' at ' + detail.time_booked}</td>
                                <td>{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td style={{ width:'7%' }}>{detail.appointment_location}</td>
                                <td style={{ width:'10%' }}>
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                                <td>{displayState(detail.state)}</td>
                                <td>
                                    {displayIfCompleted(detail.completed)}
                                    <Form.Check
                                    style={{ textAlign:'center' }}
                                    onChange={(e) => changeStatus(e, detail.id)}
                                    defaultChecked={detail.completed} size='sm' type='checkbox' />
                                </td>
                        </tr>
                        )
                    }
                })
                :
                <tr>
                    <td colSpan="10">No Request As of Yet</td>
                </tr>}
            </>
        );
    }

    return (
        <>
            <Header/>
            <Container fluid>
            <h3>Incompleted Requests</h3>
            <Table bordered hover style={{ marginBottom:'25px' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Services Requested</th>
                        <th>Date/Time <br/> Booked</th>
                        <th>Total Price/Time</th>
                        <th>Location</th>
                        <th>Booking Submitted</th>
                        <th>State</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {displayIncompletedBookingDetails()}
                </tbody>
            </Table>
            <hr/>
            <h3>Completed Requests</h3>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Services Requested</th>
                        <th>Date/Time <br/> Booked</th>
                        <th>Total Price/Time</th>
                        <th>Location</th>
                        <th>Booking Submitted</th>
                        <th>State</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {displayCompletedBookingDetails()}
                </tbody>
            </Table>
            <br/><br/>
            <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor='start'
            endAccessor='end'
            defaultDate={moment().toDate()} //current Date
            style={{ height: '250pt'}}
            />
            <br/>
            </Container>
        </>
    );
}
