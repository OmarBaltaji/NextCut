import React from 'react';

export default function CustomerAddress(props) {

    return (
        <>
            <span className="address_spans"><u>City:</u> {props.props.city}</span> <br/>
            <span className="address_spans"><u>Street:</u> {props.props.street}</span> <br/>
            <span className="address_spans"><u>Building:</u> {props.props.building}</span> <br/>
            <span className="address_spans"><u>Near:</u> {props.props.near}</span> <br/>
        </>
);

}
