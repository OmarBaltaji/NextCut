import React from 'react';
import '../../../css/Barber.css';

export default function BarberSchedule(props) {
    return (
        <>
            <span>Opening Hour: {props.props.hour_open ? props.props.hour_open : 'Not Available'}</span> <br/>
            <span>Closing Hour: {props.props.hour_close ? props.props.hour_close : 'Not Available'}</span> <br/>
            <span>Available From: {props.props.day_open ? props.props.day_open : 'Not Available'}</span> <br/>
            <span>To: {props.props.day_close ? props.props.day_close : 'Not Available'}</span> <br/> <br/>
        </>
    );
}
