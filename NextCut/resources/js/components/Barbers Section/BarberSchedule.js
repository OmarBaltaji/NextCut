import React from 'react';
import '../../../css/Barber.css';

export default function BarberSchedule(props) {
    return (
        <>
            <span className="private_schedule">
                <u>Opening Hour:</u> {props.props.hour_open ? props.props.hour_open : 'Not Available'}
            </span> <br/>
            <span className="private_schedule">
                <u>Closing Hour:</u> {props.props.hour_close ? props.props.hour_close : 'Not Available'}
            </span> <br/>
            <span className="private_schedule">
                <u>From:</u> {props.props.day_open ? props.props.day_open : 'Not Available'}
            </span> <br/>
            <span className="private_schedule">
                <u>To:</u> {props.props.day_close ? props.props.day_close : 'Not Available'}
            </span> <br/> <br/>
        </>
    );
}
