import React, {useState, useEffect} from 'react';
import Header from './Header';
import {Container} from 'react-bootstrap';

export default function Home() {

    return (
        <div>
            <Header/>
            <Container>
                <h1>Home</h1>
            </Container>
        </div>
    );
}
