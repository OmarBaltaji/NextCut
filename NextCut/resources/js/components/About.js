import React from 'react';
import Header from './Header';
import '../../css/About.css';
import {Button, Container} from 'react-bootstrap';

export default function About() {

    return (
        <>
            <Header/>
            <br/>
            <Container fluid>
                <h2 className="about_subheader">About this website</h2>
                <p className="about_p">
                    In our day and age, Coronavirus is running rampant, and people are avoiding public spaces altogether.
                    Thus, we must find ways to remotely accommodate our needs for the safety of ourselves and others.
                    Hence, with NextCut, you don't have to be subjected to any risks! Book your next appointment
                    by going through the schedule, choose the most suitable date and time for you,
                    and pick your favorite barber!
                </p>
                <h2 className="about_subheader">Also...</h2>
                <p className="about_p">
                    Eventually, once it is secure and the infection rate plummets, you can opt to go to the barber's
                    salon if you wish to do so.<br/><br/>
                    Interested in the idea? Then book your next appointment now!
                </p>
                {localStorage.getItem('role') == 'Customer' ?
                <Button className="about_btn" style={{ margin: '0 0 20px 0', fontSize:'30px' }} size='lg'
                href="/booking">
                    Book an Appointment
                </Button>
                : ''}
            </Container>
        </>

    );
}
