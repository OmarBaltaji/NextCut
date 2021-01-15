import React, {useState, useEffect, Children} from 'react';
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
import { parse } from 'uuid';

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
    const CURRENT_DATE = new Date().setDate(new Date().getDate()-1);
    const role = localStorage.getItem('role');

    if(bookingDetails.length != 0) {
        bookingDetails.forEach(detail => {
            let time_end;
            let time_start = detail.time_booked.split(':');
            let total_time_int = parseInt(detail.total_time);
            let start_hour = parseInt(time_start[0]);
            let start_min = parseInt(time_start[1]);
            if(total_time_int < 60) {
                if(start_min + total_time_int < 60) { //consider that the total_time_int is larger than 30 (35 for instance) and we booked at 16:30, that means it would add up to 16:65
                    time_end = `${start_hour}:${start_min + total_time_int}:00`;
                } else {
                    let hour_to_add = Math.floor((total_time_int + start_min)/60); //hence in case the above case happens we need to count an additional hour and recalculate the remaining mins
                    let mins_remaining = total_time_int + start_min - hour_to_add*60;
                    time_end = `${start_hour + hour_to_add}:${mins_remaining}:00`;
                }
            } else { //in case total_time_int on its own is bigger than 60 mins then we need to add the necessary hours and recalculate remaining minutes
                let hour_to_add = Math.floor(total_time_int/60);
                let mins_remaining =  total_time_int - hour_to_add*60;
                if(mins_remaining + start_min > 10) {
                    time_end = `${start_hour + hour_to_add}:${mins_remaining + start_min}:00`;
                } else {
                    time_end = `${start_hour + hour_to_add}:0${mins_remaining + start_min}:00`;
                }
            }

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
        getUserDetails();
        if(role) {
            getBookingDetails();
        }
    }, [changedRequestStatus]);

    function getBookingDetails() {
        api.getRequestDetails()
        .then(response => {
            // setBookingDetails(response.data);
            let array = response.data;
            let big_array = [];
            array.forEach(request => {
                //turn the booked date and time to a Date Object
                let date = new Date(`${request.date_booked} ${request.time_booked}:00 GMT+0200 (Eastern European Standard Time)`);
                //push the date object to the bigger object that we initially got from response
                request['sortingDate'] = date;
                //push to array
                big_array.push(request);
            })
            //sort from earliest to latest dates
            big_array.sort((a, b) => (a.sortingDate > b.sortingDate) ? 1 : -1);
            //if 1 b takes precedence, else a takes precedence
            setBookingDetails(big_array);
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
                                <td className="td_request request_thd">{index}</td>
                                <td className="td_request request_thd">{detail.service_request[0].customer.user.name}</td>
                                <td className="request_thd">{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td className="request_thd">{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request request_thd">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request request_thd">{detail.appointment_location}</td>
                                <td className="td_request request_thd">{detail.customer_address != '' ? detail.customer_address : ''}</td>
                                <td className="request_thd" className="td_request request_thd">
                                    <div  style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                        <Form.Check
                                        label='Accept'
                                        style={{ textAlign:'center' }}
                                        onChange={(e) => statusToAccept(e, detail.id)}
                                        size='sm' type='checkbox' className="checkbox1" /> &nbsp; &nbsp;
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
                    <td colSpan="10" className="nothing_request">No Request As of Yet</td>
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
                                <td className="td_request request_thd">{index}</td>
                                <td className="td_request request_thd">{detail.service_request[0].customer.user.name}</td>
                                <td className="td_request request_thd">{detail.service_request[0].customer.user.phone_number}</td>
                                <td className="request_thd">{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td className="request_thd">{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request request_thd">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request request_thd">{detail.appointment_location}</td>
                                <td className="td_request request_thd">{detail.customer_address}</td>
                                <td className="request_thd">
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                                <td className="td_request request_thd" style={{ verticalAlign:'middle' }}>
                                    <Form.Check
                                    onChange={(e) => changeStatus(e, detail.id)}
                                    defaultChecked={detail.completed} size='sm' type='checkbox'/>
                                </td>
                        </tr>
                        )
                    }
                })
                :
                <tr>
                    <td className="nothing_request" colSpan="10">No Request As of Yet</td>
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
                                <td className="td_request request_thd">{index}</td>
                                <td className="td_request request_thd">{detail.service_request[0].customer.user.name}</td>
                                <td className="td_request request_thd">{detail.service_request[0].customer.user.phone_number}</td>
                                <td className="request_thd">{detail.service_request.map(service => {
                                    return <li key={service.id}>{service.barber_service.service.type}</li>
                                })}</td>
                                <td className="request_thd">{date} <br/> {' at ' + detail.time_booked}</td>
                                <td className="td_request request_thd">{detail.total_price + '$, ' + detail.total_time + ' mins'}</td>
                                <td className="td_request request_thd">{detail.appointment_location}</td>
                                <td className="request_thd">
                                    {moment(detail.created_at).format('MMM DD YYYY')} <br/> {' at '
                                    + moment(detail.created_at).format('h:mm')}
                                </td>
                        </tr>
                        )
                    }
                })
                :
                <tr>
                    <td className="nothing_request" colSpan="10">No Request As of Yet</td>
                </tr>}
            </>
        );
    }

    function ColoredDateCellWrapper({children, value}) {
       return(
           React.cloneElement(Children.only(children), {
                style: {
                    ...children.style,
                    backgroundColor: value > CURRENT_DATE ? '#DAA520' : 'silver',
                },
            })
       );
    }

    function eventStyle(event, start, end, isSelected) {
        var backgroundColor = '#00356f';
        var style = {
            backgroundColor: backgroundColor,
            opacity: 1,
            color: 'beige',
        };
        return {
            style: style
        };
    }

    function handleOnSelectEvent(event) { //user can delete old events
        const confirm = window.confirm("Are you sure you want to remove this session from the calendar?");
        if(confirm) {
            let start_date_utc = String(event.start);
            let splitDate = start_date_utc.split(' ');
            let start_date = `${splitDate[0]} ${splitDate[1]} ${splitDate[2]} ${splitDate[3]}`;
            let time = splitDate[4].split(':');
            let start_hour = `${time[0]}:${time[1]}`;
            let event_id;
            bookingDetails.forEach(detail => {
                if(detail.date_booked == start_date && detail.time_booked == start_hour) {
                    event_id = detail.id; //to get the customer request id so it can be used in line 302
                }
            });
            const index = myEventsList.indexOf(event);
            myEventsList.splice(index, 1); //remove event from React list to render latest results

            api.deleteRequest(event_id) //remove customer request from backend
            .then(response => {
                //
            });
        }
    }

    return (
        <>
            <Header/>
            <br/>
            <Container fluid>
                <h3 className="request_subheaders">Pending Requests</h3>
                <Table className="request_table" bordered hover style={{ marginBottom:'25px', width: '1100px' }}>
                    <thead>
                        <tr>
                            <th className="request_thd" style={{ width: '30px' }}>#</th>
                            <th className="td_request request_thd" style={{ width: '145px' }}>Customer Name</th>
                            <th className="td_request request_thd" style={{ width: '170px' }}>Services Requested</th>
                            <th className="td_request request_thd" style={{ width: '120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request request_thd" style={{ width: '145px' }}>Total Price/Time</th>
                            <th className="request_thd" style={{ width: '70px' }}>Location</th>
                            <th className="request_thd" style={{ width: '150px' }}>Customer Address</th>
                            <th className="td_request request_thd" style={{ width: '140px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPendingRequests()}
                    </tbody>
                </Table>
                <hr style={{ backgroundColor:'#DAA520' }} />
                <h3 className="request_subheaders">Incomplete Requests</h3>
                <Table className="request_table" bordered hover style={{ marginBottom:'25px', width:'1300px' }}>
                    <thead>
                        <tr>
                            <th className="request_thd" style={{ width: '30px' }}>#</th>
                            <th className="td_request request_thd" style={{ width: '145px' }}>Customer Name</th>
                            <th className="request_thd" style={{ width: '135px' }}>Phone Number</th>
                            <th className="td_request request_thd" style={{ width: '170px' }}>Services Requested</th>
                            <th className="td_request request_thd" style={{ width: '120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request request_thd" style={{ width: '145px' }}>Total Price/Time</th>
                            <th className="request_thd" style={{ width: '70px' }}>Location</th>
                            <th className="request_thd" style={{ width: '150px' }}>Customer Address</th>
                            <th className="td_request request_thd" style={{ width: '120px' }}>Booking Submitted At</th>
                            <th className="td_request request_thd" style={{ width: '80px' }}>Mark As Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayIncompletedBookingDetails()}
                    </tbody>
                </Table>
                <hr style={{ backgroundColor:'#DAA520' }} />
                <h3 className="request_subheaders">Complete Requests</h3>
                <Table className="request_table" bordered hover style={{ width:'1025px' }}>
                    <thead>
                        <tr>
                            <th className="request_thd" style={{ width:'30px' }}>#</th>
                            <th className="td_request request_thd" style={{ width:'145px' }}>Customer Name</th>
                            <th className="request_thd" style={{ width: '135px' }}>Phone Number</th>
                            <th className="td_request request_thd" style={{ width:'170px' }}>Services Requested</th>
                            <th className="td_request request_thd" style={{ width:'120px' }}>Date/Time <br/> Booked</th>
                            <th className="td_request request_thd" style={{ width: '145px' }}>Total Price/Time</th>
                            <th className="request_thd" style={{ width: '70px' }}>Location</th>
                            <th className="td_request request_thd" style={{ width: '120px' }}>Booking Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayCompletedBookingDetails()}
                    </tbody>
                </Table>
                <hr style={{ backgroundColor:'#DAA520' }} />
                <span style={{ fontWeight:'bold' }} className="text-muted"><u>You can press on old events to remove them</u></span>
                <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor='start'
                endAccessor='end'
                onSelectEvent={event => handleOnSelectEvent(event)}
                defaultDate={moment().toDate()} //current Date
                style={{ backgroundColor:'beige', height: '290pt'}}
                eventPropGetter={eventStyle}
                components={{dateCellWrapper: ColoredDateCellWrapper,}}
                />
                <br/>
            </Container>
        </>
    );
}
