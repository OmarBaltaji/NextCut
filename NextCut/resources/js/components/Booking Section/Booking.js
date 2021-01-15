import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {CardColumns, Card, Button, Container, Col, Row, InputGroup, Form, FormControl} from 'react-bootstrap';
import '../../../css/Booking.css';

export default function Booking() {
    const history = useHistory();
    const [input, setInput] = useState('');
    const [listDefault, setListDefault] = useState([]);
    const [list, setList] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        getUserDetails();
        if(role) {
            getAllBarbers();
        }
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            if(response.data.roles != 'Customer') {
                history.push('/home');
            }
        }).catch(error => {
            if(error.response.status == 401) {
                history.push('/home');
            }
        })
    }

    function getAllBarbers() {
        api.getAllBarbers()
        .then(response => {
            setListDefault(response.data);
        });
    }

    async function updateInput(input) {
        const filtered = listDefault.filter(barber => {
            return barber.user.name.toLowerCase().includes(input.toLowerCase());
        })
        setInput(input);
        setList(filtered);
    }

    return (
        <div>
            <Header/>
            <br/>
            <Container>
                <h1 style={{margin: '0 0 20px -15px', color:'#DAA520'}}>Book Your Next Appointment</h1>
                <InputGroup as={Row} lg={4}>
                    <FormControl
                    type="text"
                    key="random1"
                    className="search_bar"
                    placeholder="Search Barber"
                    value={input}
                    onChange={(e) => updateInput(e.target.value)}
                    />
                    <InputGroup.Append>
                        <InputGroup.Text><i className="fas fa-search" style={{ color:'#00356f' }} /></InputGroup.Text>
                </InputGroup.Append>
                </InputGroup>
                <br/>
                <CardColumns as= {Row}>
                    {list.length != 0 ? list.map((barber) => {
                        if(barber) {
                            return (
                                <Card style={{ width:'350px', marginRight:'15px'}} lg={4} key={barber.id}
                                className='barberBooking_cards'>
                                <Card.Img src={barber.user.profile_photo} height="300px"/>
                                <Card.Body>
                                    <Card.Title className="booking_spans">{barber.user.name}</Card.Title>
                                    <Card.Text>
                                        <span className="booking_spans">
                                            {barber.salon_name ?
                                            <> Salon Name: {barber.salon_name} </>
                                            : <>Not Available </>}
                                        </span> <br/>
                                        <span className="booking_spans">
                                            Location: {barber.user.address.length != 0 ?
                                            barber.user.address[0].city : <>Not Available</>}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button className="booking_btn"
                                    href={`/booking/${barber.id}`}>Book This Barber</Button>
                                </Card.Footer>
                            </Card>
                            )
                        }
                        return null;
                    }) :
                    listDefault.length != 0 ? listDefault.map((barber) => {
                        if(barber) {
                            return (
                                <Card style={{ width:'350px', marginRight:'15px'}} lg={4} key={barber.id}
                                className='barberBooking_cards'>
                                <Card.Img src={barber.user.profile_photo} height="300px"/>
                                <Card.Body>
                                    <Card.Title className="booking_spans">{barber.user.name}</Card.Title>
                                    <Card.Text>
                                        <span className="booking_spans">
                                            {barber.salon_name ?
                                            <> Salon Name: {barber.salon_name} </>
                                            : <>Not Available </>}
                                        </span> <br/>
                                        <span className="booking_spans">
                                            Location: {barber.user.address.length != 0 ?
                                            barber.user.address[0].city : <>Not Available</>}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button className="booking_btn"
                                    href={`/booking/${barber.id}`}>Book This Barber</Button>
                                </Card.Footer>
                            </Card>
                            )
                        }
                        return null;
                    }): ''}
                </CardColumns>
            </Container>
        </div>
    );
}
