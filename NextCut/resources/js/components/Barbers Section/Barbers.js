import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {Card, CardColumns, Row, Container, InputGroup, FormControl} from 'react-bootstrap';
import moment from 'moment';
import '../../../css/Barber.css';

export default function Barber() {
    const history = useHistory();
    const [input, setInput] = useState('');
    const [listDefault, setListDefault] = useState([]);
    const [list, setList] = useState([]);

    useEffect(() => {
        getAllBarbers();
    }, []);

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

    function displayOneBarber(id) {
        history.push(`/barbers/${id}`);
    }

    function displayBarbers() {
        return (
            <CardColumns as={Row} style={{ marginLeft:'0' }}>
                {list.length != 0 ? list.map((barber) => {
                    if(barber) {
                        return (
                            <Card style={{ width:'350px', marginRight:'10px'}} lg={4} key={barber.id}
                                className="show_barber" onClick={() => displayOneBarber(barber.id)}>
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
                                <small className="text-muted">
                                    Joined: {moment(barber.user.created_at).format('DD/MM/YYYY')}
                                </small>
                            </Card.Footer>
                        </Card>
                        )
                    }
                    return null;
                    }) :
                    listDefault.length != 0 ? listDefault.map((barber) => {
                        if(barber) {
                            return (
                                <Card style={{ width:'350px', marginRight:'10px'}} lg={4} key={barber.id}
                                className="show_barber" onClick={() => displayOneBarber(barber.id)}>
                                    <Card.Img variant="top" src={barber.user.profile_photo} height="300px"/>
                                    <Card.Body>
                                        <Card.Title className="barbers_name">{barber.user.name}</Card.Title>
                                        <Card.Text>
                                        <span className="barbers_info"><u>Salon:</u> {barber.salon_name}</span> <br/>
                                        <span className="barbers_info"><u>Opening Hours:</u> {barber.hour_open}</span>  <br/>
                                        <span className="barbers_info"><u>Closing Hours:</u> {barber.hour_close}</span>  <br/>
                                        <span className="barbers_info"><u>Mobile:</u> {barber.user.phone_number}</span>  <br/>
                                        <span className="barbers_info">
                                            <u>City:</u> {barber.user.address.length != 0 ?
                                            barber.user.address[0].city : <>Not Available</>}
                                        </span>
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <small className="text-muted">
                                        Joined: {moment(barber.user.created_at).format('DD/MM/YYYY')}
                                        </small>
                                    </Card.Footer>
                                </Card>
                            )
                        }
                        return null;
                    }): ''}
            </CardColumns>
        );
    }

    return (
        <div>
            <Header/>
            <br/>
            <Container >
                <h1 className="barbers_header">Meet Your Barbers</h1>
                <InputGroup as={Row} lg={4} style={{ marginLeft:'0', marginBottom:'14px' }}>
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
                {displayBarbers()}
            </Container>
        </div>
    );
}
