import React from 'react';
import {Card, CardColumns} from 'react-bootstrap';
import moment from 'moment';
import '../../css/Barber.css';

export default function BarberSchedule(props) {
    return (
        <>
            <span>Opening Hour: {props.props.hour_open}</span> <br/>
            <span>Closing Hour: {props.props.hour_close}</span> <br/>
            <span>Available From: {props.props.day_open}</span> <br/>
            <span>To: {props.props.day_close}</span> <br/> <br/>
        </>
    );
}
