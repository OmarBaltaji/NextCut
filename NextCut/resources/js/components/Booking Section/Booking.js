import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import api from '../../api';
import {CardColumns, Card, Button, Container, Col, Row, InputGroup, Form, FormControl} from 'react-bootstrap';

export default function Booking() {
    const history = useHistory();
    const [barbers, setBarbers] = useState([]);
    const[searchedBarber, setSearchedBarber] = useState([]);
    const [searchBox, setSearchBox] = useState('');

    useEffect(() => {
        getUserDetails();
        getAllBarbers();
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            if(response.data.roles != 'Customer') {
                history.push('/home');
            }
        })
    }

    function getAllBarbers() {
        api.getAllBarbers()
        .then(response => {
            setBarbers(response.data);
        });
    }

    function handleSearch() {
        if(searchBox) {
            console.log(searchBox);
            api.getSearchedBarber({'searched_name' : searchBox})
            .then(response => {
                console.log(response.data);
                setSearchedBarber(response.data);
            })
        }
    }

    return (
        <div>
            <Header/>
            <br/>

            <Container>
            <h1 style={{margin: '0 0 20px -15px'}}>Book Your Next Appointemnt</h1>
                <InputGroup as={Row} lg={4}>
                    <FormControl
                    type="text"
                    placeholder="Search Barber"
                    onChange={(e) => setSearchBox(e.target.value)} />

                    <InputGroup.Append>
                        <Button
                        variant="outline-primary"
                        onClick={() => handleSearch()} >
                            Search
                        </Button>
                        {searchedBarber.length != 0 ?
                            <Button
                            variant="outline-primary"
                            onClick={() => setSearchedBarber([])}>
                                <i className="fas fa-times" />
                            </Button>
                        : ''}
                    </InputGroup.Append>
                </InputGroup>
                <br/>
                <CardColumns as= {Row}>
                {searchedBarber.length != 0 ?
                    searchedBarber.map(barber_user => {
                        return (
                            <Card style={{ width:'350px' }} lg={4} key={barber_user.id}>
                                <Card.Img src={barber_user.profile_photo} height="300px"/>
                                <Card.Body>
                                    <Card.Title>{barber_user.name}</Card.Title>
                                    <Card.Text>
                                        <span>Salon Name: {barber_user.barber[0].salon_name}</span> <br/>
                                        <span>Location: {barber_user.address.length != 0
                                        ? barber_user.address[0].city : 'Not Available'}</span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                { console.log(barber_user.id)}
                                    <Button href={`/booking/${barber_user.id}`}>Book This Barber</Button>
                                </Card.Footer>
                            </Card>
                        )
                    })
                    :
                    <>
                    {barbers.map(barber =>
                        <Card style={{ width:'350px' }} lg={4} key={barber.id}>
                            <Card.Img src={barber.user.profile_photo} height="300px"/>
                            <Card.Body>
                                <Card.Title>{barber.user.name}</Card.Title>
                                <Card.Text>
                                    <span>Salon Name: {barber.salon_name}</span> <br/>
                                    <span>Location: {barber.user.address.length != 0 ?
                                    barber.user.address[0].city : 'Not Available'}</span>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button href={`/booking/${barber.id}`}>Book This Barber</Button>
                            </Card.Footer>
                        </Card>
                    )}
                    </>
                }
                </CardColumns>
            </Container>
        </div>
    );
}
