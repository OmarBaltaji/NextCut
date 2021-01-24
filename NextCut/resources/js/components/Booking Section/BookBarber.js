import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import Header from '../Header';
import { InputGroup, Form, Container, Col, Row, Button } from 'react-bootstrap';
import api from '../../api';
import TimeCalendar from "react-timecalendar";
import firebase from 'firebase';
import firebaseConfig from '../../Firebase/FirebaseConfig';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function(registration) {
            //Registration is successful
      })
      .catch(function(err) {
            //Registration failed
      });
}

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
});

export default function BookBarber() {
    const [userInfo, setUserInfo] = useState([]);
    const [barber, setBarber] = useState([]);
    const [barberServicesInfo, setBarberServicesInfo] = useState([]);
    const [chosenServices, setChosenServices] = useState([]);
    const [appLocation, setAppLocation] = useState('Salon');
    const [barberPrivateSchedule, setBarberPrivateSchedule] = useState([])
    const [timeSelected, setTimeSelected] = useState();
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [customerRequest, setCustomerRequest] = useState([]);
    const [previousBookings, setPreviousBookings] = useState(false);
    const [bookedTimeslots, setBookedTimeslots] = useState([]);
    const [customerAddress, setCustomerAddress] = useState([]);
    const role = localStorage.getItem('role');
    const param = useParams();
    const history = useHistory();
    let openHours = [];
    let bookings = [];
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        getUserDetails();
        if(role) {
            getThisBarberInfo();
            getBarberServiceDetails();
            getBarberPrivateSchedule();
            getPreviousBookignsDetails();
            getAllPrevBookedTimes();
            getCustomerAddressInfo();
        }
    }, []);

    useEffect(() => {
        insertBookedTimes(); // Get the booked timeslots
    }, [bookedTimeslots])

    if(barber.length != 0 && appLocation == 'Salon') // Get the salon opening hours
        getOpenHours(barber);
    else if (barberPrivateSchedule.length != 0 && appLocation == 'Home') // Get the private schedule of the barber (Home service)
        getOpenHours(barberPrivateSchedule);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
            if(response.data.roles != 'Customer') {
                history.push('/home');
            }
        }).catch(error=> {
            if(error.response.status == 401) {
                history.push('/home');
            }
        });
    }

    function getThisBarberInfo() {
        api.getOneBarber(param.id)
        .then(response => {
            setBarber(response.data);
        })
    }

    function getBarberServiceDetails() {
        api.getBarberServices(param.id)
        .then(response => {
            setBarberServicesInfo(response.data);
        })
    }

    function getBarberPrivateSchedule() {
        api.getBarberSchedule(param.id)
        .then(response => {
            if(Object.keys(response.data).length == 0) {
                // object is empty
            }else {
                setBarberPrivateSchedule(response.data);
            }
        });
    }

    function getPreviousBookignsDetails() {  // Check if user has previous incomplete bookings
        api.getPreviousBookings()
        .then(response => {
            setCustomerRequest(response.data.service_request);
            let requests = response.data.service_request;
            requests.forEach(request => {
                if(request.customer_request.completed == 0) {
                    setPreviousBookings(true);
                }
            })
        });
    }

    function getAllPrevBookedTimes() {
        api.getBookedTimes()
        .then(response => {
            setBookedTimeslots(response.data);
        })
    }

    function getCustomerAddressInfo() {
        api.getCustomerAddress()
        .then(response => {
            setCustomerAddress(response.data[0]);
        })
    }

    function getOpenHours(schedule) {
        let open_hours = schedule.hour_open.split(':'); // The opening hours in the db is a string
        if(open_hours[0] < 10) { // If the hour is for example 09
            open_hours = parseInt(open_hours[0].split('')[1]); // It would take a single digit without the 0(so it works properly with the external library)
        } else {
            open_hours = parseInt(open_hours[0]); // Here it's a double digit
        }

        let closing_hours = schedule.hour_close.split(':');
        if(closing_hours[0] < 10) {
            closing_hours = parseInt(closing_hours[0].split('')[1]);
        } else {
            closing_hours = parseInt(closing_hours[0]);
        }

        if(schedule.day_close != 'Sunday') {
            let remaining_days = 0;
            openHours.push([0,0]) // Fill Sunday where the barber is not open
            for (let l = 1; l < weekdays.indexOf(schedule.day_open); l++) { // Fill Days where barber is not open before the opening_day
                openHours.push([0,0]);
            }
            for(let i = weekdays.indexOf(schedule.day_open); i <= weekdays.indexOf(schedule.day_close); i++) {
                openHours.push([open_hours, closing_hours]); // Fill all days up to closing_day
                remaining_days = i;
            }
            for (let j = remaining_days; j < weekdays.indexOf('Saturday'); j++ ) {
                openHours.push([0,0]); // Fill the remaining days where the barber is not open
            }
        } else {
            openHours.push([open_hours, closing_hours]); // Fill Sunday
            for (let m = 1; m < weekdays.indexOf(schedule.day_open); m++) { // Fill Days where barber is not open before the opening_day
                openHours.push([0,0]);
            }
            for(let k = weekdays.indexOf(schedule.day_open); k < weekdays.indexOf(schedule.day_close) + 6; k++) {
                openHours.push([open_hours, closing_hours]); // Fill all days before Sunday
            }
        }
    }

    function insertBookedTimes() {
        let id_to_insert = 1;
        if(bookedTimeslots.length != 0) {
            bookedTimeslots.forEach(timeSlot => {
                let splitDate = timeSlot.date_booked.split(' ');
                let month = months.indexOf(splitDate[1]) + 1 // Get which month (in numbers)
                if (month < 10) { // In case the month is less than 10 we prefix a 0 to it
                    month = '0' + String(month);
                }
                let startTime = timeSlot.time_booked;
                let start_date_time = `${splitDate[3]}-${month}-${splitDate[2]} ${startTime}:00`; // The format that is needed to be used in the calendar

                let timeSplit = timeSlot.time_booked.split(':'); //split hour and mins
                let endTime;
                if(parseInt(timeSlot.total_time) < 60) {
                    endTime= `${timeSplit[0]}:${parseInt(timeSplit[1]) + parseInt(timeSlot.total_time)}:00`
                } else {
                    let hour_to_add = Math.floor(parseInt(timeSlot.total_time)/60); // Get the additional hours that we need to add to the inital hour
                    let mins_remaining =  parseInt(timeSlot.total_time) - hour_to_add*60; // Get the remaining minutes
                    endTime = `${parseInt(timeSplit[0])+parseInt(hour_to_add)}:${parseInt(timeSplit[1])+mins_remaining}:00`;
                }

                let end_date_time = `${splitDate[3]}-${month}-${splitDate[2]} ${endTime}`;

                let time_booked = { // To insert booked times we need to pass them as an object to the calendar library
                    id: id_to_insert,
                    start_time: start_date_time,
                    end_time: end_date_time,
                }

                bookings.push(time_booked);
                id_to_insert += 1; //to add different ids to different booking times (starts at 1)
            });
            bookings.forEach(booking => {
                let start_date = new Date(booking.start_time);
                let today_date = new Date();
                if(start_date < today_date) { // If the start_date of the booking is older than the current's date than we can remove it from the bookings list
                    let index_to_remove = bookings.indexOf(booking);
                    bookings.splice(index_to_remove, 1);
                }
            })
        }
    }

    function hanldeChosenServices(e) {
        setChosenServices(Array.from(e.target.selectedOptions, option => option.value)); // To set an array consisting of services' type, duration and price
    }

    function displayChosenServices() {

        let sum_price = 0;
        let sum_time = 0;

        if(chosenServices.length != 0) {
            chosenServices.map(service => {
                let s = service.split(',');
                sum_price += parseInt(s[0]);
                sum_time += parseInt(s[1]);
            });
        }

        return (
            <>
                {
                <span style={{ color:'#00356f' }}>
                    <strong style={{ textDecoration:'underline', color:'#00356f' }}>Total price and time:</strong>
                    &nbsp;
                    {chosenServices.length != 0 ? sum_price + '$, ': 0}
                    {chosenServices.length != 0 ? sum_time + ' mins' : ''}
                </span>
                }
            </>
        );
    }

    function handleAppLocation(e) {
        if(e.target.value == 'Salon') {
            setAppLocation('Salon');
        } else if (e.target.value == 'Home') {
            setAppLocation('Home');
        }
    }

    function displayChosenDateAndTime() {
        let time_select_array = (String(timeSelected).split(' '));
        let hour_selected = time_select_array[4].split(':');

        return (
            <>
                <span className="time_selected">{time_select_array[0] + ', '}</span>
                <span className="time_selected">{time_select_array[1] + ' ' + time_select_array[2] + ' ' + time_select_array[3] + ' at '}</span>
                <span className="time_selected">{hour_selected[0] + ':' + hour_selected[1]}</span>
            </>
        );
    }

    function handleRedirectToConfirmation() {
        if(chosenServices.length == 0) {
            alert('You need to select services first');
            return;
        } else if (!timeSelected) {
            alert('You need to select date and time');
            return;
        }

        let sum_price = 0;
        let sum_time = 0;
        let services_id = [];

        chosenServices.map(service => {
            let s = service.split(',');
            sum_price += parseInt(s[0]);
            sum_time += parseInt(s[1]);
            services_id.push(parseInt(s[2]));
        });

        let time_select_array = (String(timeSelected).split(' '));
        let hour_selected = time_select_array[4].split(':');

        let booked_date = time_select_array[0] + ' ' + time_select_array[1] + ' ' + time_select_array[2] + ' ' + time_select_array[3];
        let booked_time = hour_selected[0] + ':' + hour_selected[1];

        const address =
        customerAddress && appLocation == 'Home' ? `${customerAddress.city}, ${customerAddress.street}, ${customerAddress.building}, ${customerAddress.near}` : '';

        const info = {
            date_booked: booked_date,
            time_booked: booked_time,
            total_price: sum_price,
            total_time: sum_time,
            appointment_location: appLocation,
            customer_address: address,
            barber_service_id: services_id,
        };

        api.storeCustomerRequest(info)
        .then(response => {
            history.push({
                pathname: '/confirmedbooking',
                state: {
                        payment_method: paymentMethod,
                        time_selected: String(timeSelected).split(' '),
                        chosen_services: chosenServices,
                        app_location: appLocation,
                        barber_name: barber.user.name,
                        customer_address: customerAddress ?  customerAddress : '',
                    }
                });

            const query = db.collection('fcm_token').where('userID', '==', barber.user.FirebaseUID).get(); // Get the firebase could message token where the userID is equal to the barber UID

            query.then(snapshot => {
                    let data = snapshot.docs[0].data();
                    notification(data.userToken, response.data.id);
                })

        }).catch(error => {
            //Error while fetching request
        })
    }

    function handleTimeSelected(time) {
        setTimeSelected(time);
      }
      const MyCalendar = () => (
        <TimeCalendar
          disableHistory
          clickable
          timeSlot={30}
          openHours={openHours}
          onTimeClick={handleTimeSelected}
          bookings={bookings}
        />
      );

      function notification(fcm_token, request_id) { // Send notification to the barber about the booking that was just made
        const notification = {
            "notification": {
                "title": "Incoming Request",
                "body": `${userInfo.name} has requested a session`,
                "click_action": "http://127.0.0.1:8000/requests",
            },
            "to": fcm_token,
        }

        const header = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Key=AAAAR2QjVTI:APA91bFnVdfPo0kXeeEHURUik1Q0gN-MaPCmlnJWP5Fc2oXwX591yjpqoqRBUBwulUHqBisFYX0r46rwab2QJI2BH-qvTJiaV865_ktw-ljuFQGRo4H3Ljo-VdiomIJmRFe01bvTdbNi'
                },
            }

        axios.post('https://fcm.googleapis.com/fcm/send', notification , header)
        .then((response) => {
                let request_id_str = String(request_id);
                const notificationRef = db.collection('notifications').doc(request_id_str);

                notificationRef.set({ // Save notification in Firestore
                    title: 'Booking Request',
                    message: `${userInfo.name} wants to book an appointment`,
                    toUserID: barber.user.FirebaseUID, //barber
                    fromUserID: userInfo.FirebaseUID, //logged in user
                    isOpened: false,
                    created: firebase.firestore.Timestamp.now(),
                });
            });
    }

    return (
        <>
            <Header />
            <br/>
            <Container>
                <Row>
                    <Col>
                        <h3 className="book_subheaders">
                            You are booking an appointment with {barber.length != 0 ? barber.user.name : ''}
                        </h3>
                    </Col>
                </Row>
                <br/>
                    <Row>
                        <Col lg={6}>
                            <InputGroup>
                                <Form.Label className="book_labels">Services: &nbsp;</Form.Label>
                                <Form.Control
                                as="select"
                                className="booking_input"
                                multiple
                                required
                                onChange={(e) => hanldeChosenServices(e)}>
                                    {barberServicesInfo.length != 0 ?
                                    barberServicesInfo.map(barberService =>
                                    <option key={barberService.id}
                                    className="option"
                                    value={[
                                        barberService.price, barberService.estimated_time,
                                        barberService.id, barberService.service.type
                                    ]}>
                                        {`${barberService.service.type} - ${barberService.price}$,
                                        ${barberService.estimated_time} mins`}
                                    </option>)
                                    : ''}
                                </Form.Control>
                            </InputGroup>
                            <br/>
                            {displayChosenServices()}
                        </Col>
                        <Col lg={6}>
                            <InputGroup>
                                <Form.Label className="book_labels">Appointment Location:  &nbsp;</Form.Label>
                                <Form.Control
                                className="booking_input"
                                as="select"
                                id = 'appointment'
                                required
                                onChange={(e) => handleAppLocation(e)}>
                                    <option key={0} value={'Salon'}>Salon</option>
                                    {barberPrivateSchedule.length == 0 || !customerAddress ?
                                    <option key={1} disabled>Home</option>
                                    : <option key={1} value={'Home'}>Home</option>}
                                </Form.Control>
                            </InputGroup>
                            {barberPrivateSchedule.length != 0 ?
                            <></>
                            :
                            <small className="text-muted" style={{ marginLeft:'170px', fontWeight:'bold' }}>
                                This barber doesn't provide service at home
                            </small>}
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            {MyCalendar()}
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <span className="book_labels" style={{ textDecoration:'underline' }}>
                                Time Selected:
                            </span>
                            &nbsp;
                            {timeSelected ? displayChosenDateAndTime()
                            : <span style={{ color:'#00356f' }}>None chosen yet</span>}
                        </Col>
                    </Row>
                    <br/>
                    {previousBookings == true ?
                    <span style={{ color: '#00356f', fontWeight:'bold', fontSize:'18px', marginLeft:'390px',
                    paddingBottom:'10px' }}>
                        Cannot book more than one appointment
                    </span>
                    : <Button className="booking_btn" size='lg' block
                    onClick={() => handleRedirectToConfirmation()}>
                        Book Now!
                    </Button> }
                    <br/>
            </Container>
        </>
    );
}
