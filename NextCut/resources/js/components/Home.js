import React, {useState, useEffect} from 'react';
import Header from './Header';
import {Container, Button} from 'react-bootstrap';

export default function Home() {

    return (
        <div>
            <Header/>
            <br/>
            <Container fluid>
                <h1>Home</h1>
            </Container>
        </div>
    );
}
