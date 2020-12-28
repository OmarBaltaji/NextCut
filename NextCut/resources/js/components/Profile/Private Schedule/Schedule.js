import React, { useEffect, useState } from 'react';
import api from '../../../api';

export default function SalonInfo(props) {
    console.log(props.props[0])
    return (
        <>
            <span>Opens: {props.props[0].hour_open}</span> &nbsp;
            <span>| &nbsp;Closes: {props.props[0].hour_close}</span> <br/>
            <span>From {props.props[0].day_open}</span> &nbsp;
            <span>To {props.props[0].day_close}</span>
        </>
    );
}
