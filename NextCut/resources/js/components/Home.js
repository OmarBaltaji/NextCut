import React, {useState, useEffect} from 'react';
import Header from './Header';
import {Container, Button, Row, Col, Image} from 'react-bootstrap';
import '../../css/Home.css';
import api from '../api';

export default function Home() {
    const [userInfo, setUserInfo] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        getUserDetails();
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
        })
    }

    return (
        <div>
            <Header/>
            <br/>
            <Container fluid>
                <Row>
                    <Col lg={4}>
                        <h3 className="sub_header">Book your appointment at home</h3>
                        <p className="paragraphs">
                            Hair and beard need tending and afraid to go outside? Stay safe! Book your next appointment
                            with your favorite barber at your very own household!
                        </p>
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/couch-laptop.png"
                         alt="person sitting at home with laptop"
                        width="370px" height="270px" />
                    </Col>
                    <Col lg={4}>
                        <Image src="../images/barber-wearing-mask.jpg" alt="barber with protective mask on"
                        width="370px" height="270px" />
                    </Col>
                </Row>
                <br/>
                <Row style={{ marginBottom:'20px' }}>
                    <Col lg={4}>
                        <h3 className="sub_header">Or book it at the salon</h3>
                        <p className="paragraphs">
                            Is it post-pandemic, and you feel like taking a trip to the salon? We cover that too!
                            Eliminate the unnecessary wait by reserving your spot weeks ahead.
                        </p>
                        <br/>
                        {userInfo.roles == 'Customer' || role == 'Customer'  ?
                        <Button size="lg" href="/booking" className="book_button">Book Here!</Button>
                        : ''}
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/stylish-hairdresser.jpg"
                         alt="barber preparing customer for a haircut"
                        width="370px" height="270px" />
                    </Col>
                    <Col lg={4}>
                        <Image src="../images/barber-styling.jpg" alt="barber styling customer's hair"
                        width="370px" height="270px" />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col lg={4}>
                        <h3 className="sub_header">Browse Barbers</h3>
                        <p className="paragraphs">
                            Not sure which barber to pick?<br/>
                            <a className="links" href='/barbers'>Browse</a>
                            the available barbers and find more about them! You can seek information regarding
                            their location, salon/private schedules, and even check their galleries.
                        </p>
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/hairdresser-with-client.jpg"
                         alt="group of barbers styling their customers' hair"
                        width="370px" height="270px" />
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/barber-styling2.jpg"
                        alt="group of barbers styling their customers' hair and facial hair"
                        width="370px" height="270px" />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col lg={4}>
                        <h3 className="sub_header">Chat with Barbers</h3>
                        <p className="paragraphs">
                            You can even interact with any registered barbers and get to know them better.
                            <a className="links" href="/chat" style={{ marginLeft:'3px' }}>Chat</a>
                            with them now and ask whatever you fancy. They’re a friendly bunch!
                        </p>
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/hand-chat.jpg"
                        alt="person chatting on laptop"
                        width="370px" height="270px" />
                    </Col>
                    <Col lg={4}>
                        <Image className="home_images" src="../images/man-cartoon.jpg"
                        alt="person chatting on laptop"
                        width="370px" height="270px" />
                    </Col>
                </Row>
                <br/>
            </Container>
        </div>
    );
}
