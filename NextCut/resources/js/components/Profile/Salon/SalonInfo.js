import React, { useEffect, useState } from 'react';
import api from '../../../api';
import moment from 'moment';
import '../../../../css/Profile.css';

export default function SalonInfo(props) {

    return (
        <>
            <span className="profile_spans"><u>Salon Name:</u> {props.props.salon_name}</span> <br/>
            <span className="profile_spans"><u>Opens:</u> {props.props.hour_open}</span> &nbsp;
            <span className="profile_spans">| &nbsp;<u>Closes:</u> {props.props.hour_close}</span> <br/>
            <span className="profile_spans"><u>From:</u> {props.props.day_open}</span> <br/>
            <span className="profile_spans"><u>To:</u> {props.props.day_close}</span>
        </>
    );
}
