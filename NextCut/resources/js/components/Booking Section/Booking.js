import React, {useEffect, useState} from 'react';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import api from '../../api';
import {CardColumns, Card, Button, Container, Col, Row, InputGroup, Form, FormControl} from 'react-bootstrap';

export default function Booking() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [barbers, setBarbers] = useState([]);
    const[searchedBarber, setSearchedBarber] = useState([]);
    const [searchBox, setSearchBox] = useState('');

    useEffect(() => {
        getAllBarbers();
    }, []);

    function getAllBarbers() {
        api.getAllBarbers()
        .then(response => {
            setBarbers(response.data);
        });
    }

    function handleSearch() {
        if(searchBox) {
            let searchResult = searchBox.split(' ');
            let capitalizedName = [];
            for(let i = 0; i < searchResult.length; i++) {
                capitalizedName.push(searchResult[i][0].toUpperCase() + searchResult[i].slice(1).toLowerCase());
            }
            let capitalizedResult = capitalizedName.join(' ');
            let resultBarber = barbers.filter(barber => barber.user.name == capitalizedResult);
            setSearchedBarber(resultBarber);
        }
    }

    return (
        <div>
            <Header/>
            <h1 style={{margin: '0 0 20px 68px'}}>Book Your Next Appointemnt</h1>
            <Container>

                <InputGroup as={Row} lg={4}>
                    <FormControl
                    type="text"
                    placeholder="Search Barber"
                    // value={searchBox}
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
                                <i class="fas fa-times" />
                            </Button>
                        : ''}
                    </InputGroup.Append>
                </InputGroup>
                <br/>
                <CardColumns as= {Row}>
                {searchedBarber.length != 0 ?
                    <Card style={{ width:'350px' }} lg={4} key={searchedBarber[0].id}>
                        <Card.Img src={searchedBarber[0].user.profile_photo} height="300px"/>
                        <Card.Body>
                            <Card.Title>{searchedBarber[0].user.name}</Card.Title>
                            <Card.Text>
                                <span>Salon Name: {searchedBarber[0].salon_name}</span> <br/>
                                <span>Location: {searchedBarber[0].user.address.length != 0 ? searchedBarber[0].user.address[0].city : 'Not Available'}</span>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button href={`/booking/${searchedBarber[0].id}`}>Book Now</Button>
                        </Card.Footer>
                    </Card>
                    :
                    <>
                    {barbers.map(barber =>
                        <Card style={{ width:'350px' }} lg={4} key={barber.id}>
                            <Card.Img src={barber.user.profile_photo} height="300px"/>
                            <Card.Body>
                                <Card.Title>{barber.user.name}</Card.Title>
                                <Card.Text>
                                    <span>Salon Name: {barber.salon_name}</span> <br/>
                                    <span>Location: {barber.user.address.length != 0 ? barber.user.address[0].city : 'Not Available'}</span>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button href={`/booking/${barber.id}`}>Book Now</Button>
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
