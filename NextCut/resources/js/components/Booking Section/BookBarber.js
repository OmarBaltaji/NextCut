import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { InputGroup, Form, Container, Col, Row, Button } from 'react-bootstrap';
import api from '../../api';

export default function BookBarber() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const[barber, setBarber] = useState([]);
    const[barberServicesInfo, setBarberServicesInfo] = useState([]);
    const [chosenServices, setChosenServices] = useState([]);
    const [appLocation, setAppLocation] = useState('Home');
    const [barberPrivateSchedule, setBarberPrivateSchedule] = useState([])
    const param = useParams();

    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var d_salon = new Date(); //current date
    var available_salon_days = [];
    var d_home = new Date();
    var available_home_days = [];
    // d_salon.setDate(29);
    // d_home.setDate(22f);

    if(barber.length != 0) {
        let salon_opening_day = weekdays.indexOf(barber.day_open);
        let salon_closing_day = weekdays.indexOf(barber.day_close);
        if (d_salon.getDay() == 0 && salon_closing_day != 0) {//if sunday is not included in the schedule
            available_salon_days = [];
        }
        else if(d_salon.getDay() < salon_closing_day) {
            for(let j = 0; j < salon_closing_day + 1 - (d_salon.getDay()); j++) { //available days during the week
                available_salon_days.push(j);
            }
        }
        else if(d_salon.getDay() == salon_closing_day) {
            available_salon_days.push(0); //we only have this day left within the week
        }
        for(let i = 0; i < salon_closing_day + 1; i++) {
            if(weekdays[i] == barber.day_open) {
                if(salon_opening_day == d_salon.getDay()) //if opening day is the current date
                    d_salon.setDate(d_salon.getDate() + (i + 7 - d_salon.getDay()) % 7); //set the starting time to the current day
            }
        }
        //for next week
        let next_week_salon_opening_day = salon_opening_day + 6;
        let next_week_salon_closing_day = salon_closing_day + 7;

        for(let k = next_week_salon_opening_day; k < next_week_salon_closing_day; k++) {
            available_salon_days.push(k + 1 - d_salon.getDay());
        }
        //for next next week
        let next_next_week_salon_opening_day = salon_opening_day + 13;
        let next_next_week_salon_closing_day = salon_closing_day + 14;

        for(let l = next_next_week_salon_opening_day; l < next_next_week_salon_closing_day; l++) {
            available_salon_days.push(l + 1 - d_salon.getDay());
        }
    }

    if(barberPrivateSchedule.length != 0) {
        let home_opening_day = weekdays.indexOf(barberPrivateSchedule.day_open);
        let home_closing_day = weekdays.indexOf(barberPrivateSchedule.day_close);
        if (d_home.getDay() == 0 && home_closing_day != 0) { //if sunday is not included in the schedule
            available_home_days = [];
        }
        else if(d_home.getDay() < home_closing_day) {
            for(let j = 0; j < home_closing_day + 1 - (d_home.getDay()); j++) { //available days during the week
                available_home_days.push(j);
            }
        }
        else if(d_home.getDay() == home_closing_day) {
            available_home_days.push(0); //we only have this day left within the week
        }
        for(let i = 0; i < home_closing_day + 1; i++) {
            if(weekdays[i] == barberPrivateSchedule.day_open) {
                if(home_opening_day == d_home.getDay()) //if opening day is the current date
                d_home.setDate(d_home.getDate() + (i + 7 - d_home.getDay()) % 7); //set the starting time to the current day
            }
        }
        //for next week
        let next_week_home_opening_day = home_opening_day + 6;
        let next_week_home_closing_day = home_closing_day + 7;

        for(let k = next_week_home_opening_day; k < next_week_home_closing_day; k++) {
            available_home_days.push(k + 1 - d_home.getDay());
        }
        //for next next week
        let next_next_week_home_opening_day = home_opening_day + 13;
        let next_next_week_home_closing_day = home_closing_day + 14;

        for(let l = next_next_week_home_opening_day; l < next_next_week_home_closing_day; l++) {
            available_home_days.push(l + 1 - d_home.getDay());
        }
    }

    //Calendar

    // which days are available for booking
    const availableTimeslots = (barber.length != 0 && appLocation == 'Salon') ?
        available_salon_days.map((id) => {
            return {
                id,
                startTime: new Date(new Date(new Date().setDate(d_salon.getDate() + id)).setHours(barber.hour_open.split(':')[0], 0, 0, 0)),
                endTime: new Date(new Date(new Date().setDate(d_salon.getDate() + id)).setHours(barber.hour_close.split(':')[0], 0, 0, 0)),
                };
            })

        : barberPrivateSchedule.length != 0 && appLocation == 'Home' ?
        available_home_days.map((id) => {
            return {
                id,
                startTime: new Date(new Date(new Date().setDate(d_home.getDate() + id)).setHours(barberPrivateSchedule.hour_open.split(':')[0], 0, 0, 0)),
                endTime: new Date(new Date(new Date().setDate(d_home.getDate() + id)).setHours(barberPrivateSchedule.hour_close.split(':')[0], 0, 0, 0)),
                };
            })

        : [0].map((id) => {
            return {
                id,
                startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(0, 0, 0, 0)),
                endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(0, 0, 0, 0)),
                };
            });

    useEffect(() => {
        getThisBarberInfo();
        getBarberServiceDetails();
        getBarberPrivateSchedule();
    }, []);

    function displayScheduler() {
        if (availableTimeslots) {
            return(
                <ScheduleMeeting
                borderRadius={10}
                primaryColor="#3f5b85"
                eventDurationInMinutes={60}
                availableTimeslots={availableTimeslots}
                onStartTimeSelect={console.log}
                />
            );
        }
    }

    function getThisBarberInfo() {
        api.getOneBarber(param.id)
        .then(response => {
            setBarber(response.data);
        })
    }

    function getBarberServiceDetails() {
        api.getOneBarberServiceDetails(param.id)
        .then(response => {
            setBarberServicesInfo(response.data);
        })
    }

    function getBarberPrivateSchedule() {
        api.getBarberSchedule(param.id)
        .then(response => {
            setBarberPrivateSchedule(response.data);
        });
    }

    function hanldeChosenServices(e) {
        setChosenServices(Array.from(e.target.selectedOptions, option => option.value));
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
            {chosenServices.length != 0 ?
            <span>Total: {sum_price}$, {sum_time} mins</span> : ''}
            </>
        );
    }

    function handleAppLocation(e) {
        if(e.target.value == 'Salon') {
            setAppLocation('Salon');
            alert("HI");
        } else if (e.target.value == 'Home') {
            setAppLocation('Home');
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col>
                        <h3>You are booking an appointment with {barber.length != 0 ? barber.user.name : ''}</h3>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col lg={6}>
                        <InputGroup>
                            <Form.Label>Services: &nbsp;</Form.Label>
                            <Form.Control
                            as="select"
                            multiple
                            onChange={(e) => hanldeChosenServices(e)}>
                                {barberServicesInfo.length != 0 ?
                                barberServicesInfo.map(barberService =>
                                <option key={barberService.id} value={[barberService.price, barberService.estimated_time]}>{`${barberService.service.type} - ${barberService.price}$, ${barberService.estimated_time} mins`}</option>)
                                : ''}
                            </Form.Control>
                        </InputGroup>
                        <br/>
                        {displayChosenServices()}
                    </Col>
                    <Col lg={6}>
                        <InputGroup>
                            <Form.Label>Appointment Location:  &nbsp;</Form.Label>
                            <Form.Control
                            as="select"
                            id = 'appointment'
                            onChange={(e) => handleAppLocation(e)}>
                                <option key={0} value={'Home'}>Home</option>
                                <option key={1} value={'Salon'}>Salon</option>
                            </Form.Control>
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                {availableTimeslots ? displayScheduler() : ''}
                </Row>
            </Container>
        </>
    );
}
