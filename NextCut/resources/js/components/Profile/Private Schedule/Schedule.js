import React from 'react';

export default function ScheduleInfo(props) {
    return (
        <>
            <span className="schedule_spans"><u>Opens:</u> {props.props[0].hour_open}</span> &nbsp;
            <span className="schedule_spans">| &nbsp;<u>Closes:</u> {props.props[0].hour_close}</span> <br/>
            <span className="schedule_spans"><u>From:</u> {props.props[0].day_open}</span> <br/>
            <span className="schedule_spans"><u>To:</u> {props.props[0].day_close}</span>
        </>
    );
}
