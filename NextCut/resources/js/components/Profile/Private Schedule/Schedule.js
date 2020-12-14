import React, { useEffect, useState } from 'react';
import api from '../../../api';

export default function SalonInfo(props) {

    return (
        <>
            <span>Opens: {props.props.hour_open} am</span> &nbsp;
            <span>| &nbsp;Closes: {props.props.hour_close} pm</span> <br/>
            <span>From {props.props.day_open}</span> &nbsp;
            <span>To {props.props.day_close}</span>
        </>
    );
}
