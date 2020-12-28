import React from 'react';
import Header from './Header';
import CookieService from '../Service/CookieService';
import {Button} from 'react-bootstrap';

export default function About() {
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');

    return (
        <div>
            <Header/>
            <h2 style={{ marginLeft:'20px' }}>About this website</h2>
            <p style={{ fontSize:'25px', marginLeft:'20px' }}>
            In an age where the Coronavirus is running rampant and people (to the joy of introverts) are avoiding
            public spaces altogether, it becomes more important to find ways to accommodate our needs remotely
            for the safety of our ourselves and others. Hence, with NextCut, you don't have to be subjected to
            any risks! Book your next appointment by going through the schedule, choose the most suitable date
            and time for you and pick your favorite barber!
            </p>
            <h2 style={{ marginLeft:'20px' }}>What we can do for you</h2>
            <p style={{ fontSize:'25px', marginLeft:'20px' }}>
            Don't know any? That's okay you can browse a barber's profile and check all the information related
            to him/her.<br/>
            See the reviews, have a look at their gallery, and even go over their services and prices, all at the comfort
            of your home. You can even chat with your barber and get to know him!<br/>
            Choose your hairstyle, the type of services  and even the products you want the barber to use.
            </p>
            <h2 style={{ marginLeft:'20px' }}>Also...</h2>
            <p style={{ fontSize:'25px', marginLeft:'20px' }}>
            Eventually when the time is right and the infection rate plummets, you can opt to go to the barber's salon
            if you wish to do so.<br/> <br/>
            Interested in the idea? then book your next appoitnment now!
            </p>
            {localStorage.getItem('role') != 'Barber' ?
            <Button style={{ margin: '0 0 20px 20px', fontSize:'30px' }} size='lg' href="/booking">
                Book an Appointment
            </Button>
            : ''}
        </div>
    );
}
