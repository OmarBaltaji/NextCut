import React, { useEffect, useState } from 'react';
import api from '../../../api';
import moment from 'moment';

export default function SalonInfo(props) {

    return (
        <>
            <span>Salon Name: {props.props.salon_name}</span> <br/>
            <span>Opens: {props.props.hour_open}</span> &nbsp;
            <span>| &nbsp;Closes: {props.props.hour_close}</span> <br/>
            <span>From {props.props.day_open}</span> &nbsp;
            <span>To {props.props.day_close}</span>
        </>
    );
}
