import React, { useEffect, useState } from 'react';

export default function Address(props) {
    console.log(props);
    return (
        <>
            <span>City: {props.props.city}</span> <br/> <br/>
            <span>Street: {props.props.street}</span> <br/> <br/>
            <span>Building: {props.props.building}</span> <br/> <br/>
            <span>Near: {props.props.near}</span> <br/> <br/>
        </>
);

}
