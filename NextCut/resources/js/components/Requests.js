import React, {useState, useEffect} from 'react';
import Header from './Header';
import {Container, Table, Form} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import api from '../api';
import moment from 'moment';
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { error } from 'jquery';
import '../../css/Request.css';
import firebase from 'firebase';

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
    });

export default function Requests() {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [changedRequestStatus, setChangedRequestStatus] = useState([]);
    const history = useHistory();
    const localizer = momentLocalizer(moment);
    let myEventsList = [];

    if(bookingDetails.length != 0) {
        bookingDetails.forEach(detail => {
            let time_end;
            let time_start = detail.time_booked.split(':');
            if(parseInt(detail.total_time) < 60) {
                time_end = `${time_start[0]}:${detail.total_time}:00`;
                console.log(time_end)
            } else {
                let hour_to_add = Math.floor(parseInt(detail.total_time)/60);
                let mins_remaining =  parseInt(detail.total_time) - hour_to_add*60;
                time_end = `${parseInt(time_start[0]) + parseInt(hour_to_add)}:${mins_remaining}:00`;
            }

        //    let time_end = parseInt(detail.time_booked.split(':')[0]) + Math.ceil((detail.total_time)/60);
            myEventsList.push(
                    {
                        title: detail.service_request[0].customer.user.name,
                        start: new Date(`${detail.date_booked} ${detail.time_booked} GMT+0200 (Eastern European Standard Time)`),
                        end: new Date(`${detail.date_booked} ${time_end} GMT+0200 (Eastern European Standard Time)`),
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
            // console.log(response.data)
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

    function statusToAccept(e, request_id) {
        let info;
        if(e.target.checked) {
            info = {
                completed: 0,
                customer_request_id: request_id,
                state: 1,
            };
        }
        api.alterStatus(info)
        .then(response => {
            setChangedRequestStatus(response.data);
        });
    }

    function statusToDecline(e, request_id) {
        let info;
        if(e.target.checked) {
            api.deleteRequest(request_id)
            .then(response => {
                setChangedRequestStatus(response.data);

                db.collection('notifications').doc(`${request_id}`).delete()
                .then((response) => {
                    console.log('doc deleted');
                }).catch((error) => {
                   console.log('delete error', error)
            })
            })
        }

    }

    function displayPendingRequests() {
        return (
            <>
             {bookingDetails.length != 0 ?
                bookingDetails.map((detail, index) => {
                   if(detail.completed == 0 && detail.state == 0) {
                        let date = detail.date_booked.split(' ');
                        date = `${date[1]} ${date[2]} ${date[3]}`;
                        return (
                        <tr key={detail.id}>
                                <td className="td_request">{index}</td>
                                <td className="td_request">{detail.service_request[0].customer.user.name}</td>
                                <td>{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td>{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request">{detail.appointment_location}</td>
                                <td className="td_request">{displayState(detail.state)}</td>
                                <td className="td_request">
                                    <div  style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                        <Form.Check
                                        label='Accept'
                                        style={{ textAlign:'center' }}
                                        onChange={(e) => statusToAccept(e, detail.id)}
                                        size='sm' type='checkbox' /> &nbsp; &nbsp;
                                        <Form.Check
                                        label='Decline'
                                        style={{ textAlign:'center' }}
                                        onChange={(e) => statusToDecline(e, detail.id)}
                                        size='sm' type='checkbox' />
                                    </div>
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

    function displayIncompletedBookingDetails() {
        return (
            <>
                {bookingDetails.length != 0 ?
                bookingDetails.map((detail, index) => {
                   if(detail.completed == 0 && detail.state == 1) {
                        let date = detail.date_booked.split(' ');
                        date = `${date[1]} ${date[2]} ${date[3]}`;
                        return (
                        <tr key={detail.id}>
                                <td className="td_request">{index}</td>
                                <td className="td_request">{detail.service_request[0].customer.user.name}</td>
                                <td className="td_request">{detail.service_request[0].customer.user.phone_number}</td>
                                <td>{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td>{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request">{detail.appointment_location}</td>
                                <td>
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                                <td className="td_request">{displayState(detail.state)}</td>
                                <td className="td_request">
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
                       let date = detail.date_booked.split(' ');
                       date = `${date[1]} ${date[2]} ${date[3]}`;
                        return (
                        <tr key={detail.id}>
                                <td className="td_request">{index}</td>
                                <td className="td_request">{detail.service_request[0].customer.user.name}</td>
                                <td className="td_request">{detail.service_request[0].customer.user.phone_number}</td>
                                <td>{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td>{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request">{detail.appointment_location}</td>
                                <td>
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                                <td className="td_request">{displayState(detail.state)}</td>
                                <td className="td_request">
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
            <br/>
            <Container fluid>
                <h3>Pending Requests</h3>
                <Table bordered hover style={{ marginBottom:'25px', width: '1000px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30px' }}>#</th>
                            <th className="td_request" style={{ width: '145px' }}>Customer Name</th>
                            <th className="td_request" style={{ width: '170px' }}>Services Requested</th>
                            <th className="td_request" style={{ width: '120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request" style={{ width: '145px' }}>Total Price/Time</th>
                            <th style={{ width: '70px' }}>Location</th>
                            <th className="td_request" style={{ width: '145px' }}>State</th>
                            <th className="td_request" style={{ width: '180px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPendingRequests()}
                    </tbody>
                </Table>
                <hr/>
                <h3>Incompleted Requests</h3>
                <Table bordered hover style={{ marginBottom:'25px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30px' }}>#</th>
                            <th className="td_request" style={{ width: '145px' }}>Customer Name</th>
                            <th style={{ width: '135px' }}>Phone Number</th>
                            <th className="td_request" style={{ width: '170px' }}>Services Requested</th>
                            <th className="td_request" style={{ width: '120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request" style={{ width: '145px' }}>Total Price/Time</th>
                            <th style={{ width: '70px' }}>Location</th>
                            <th className="td_request" style={{ width: '120px' }}>Booking Submitted</th>
                            <th className="td_request" style={{ width: '145px' }}>State</th>
                            <th className="td_request" style={{ width: '145px' }}>Status</th>
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
                            <th style={{ width:'30px' }}>#</th>
                            <th className="td_request" style={{ width:'145px' }}>Customer Name</th>
                            <th style={{ width: '135px' }}>Phone Number</th>
                            <th className="td_request" style={{ width:'170px' }}>Services Requested</th>
                            <th className="td_request" style={{ width:'120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request" style={{ width: '145px' }}>Total Price/Time</th>
                            <th style={{ width: '70px' }}>Location</th>
                            <th className="td_request" style={{ width: '120px' }}>Booking Submitted</th>
                            <th className="td_request" style={{ width: '145px' }}>State</th>
                            <th className="td_request" style={{ width: '145px' }}>Status</th>
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
