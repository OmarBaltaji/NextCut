import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import api from '../../api';
import {Card, CardColumns, Row, Container} from 'react-bootstrap';
import moment from 'moment';
import '../../../css/Barber.css';

export default function Barber() {
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [barbers, setBarbers] = useState([]);
    const history = useHistory();

    useEffect(() => {
        getAllBarbers();
    }, []);

    function getAllBarbers() {
        api.getAllBarbers()
        .then(response => {
            // console.log(response.data);
            setBarbers(response.data);
        });
    }

    function displayOneBarber(id) {
        history.push(`/barbers/${id}`);
    }

    function displayBarbers() {
        return (
            <Container fluid>
            <CardColumns as={Row} style={{ margin: '0 53px' }}>
                {barbers.map((barber) =>
                <Card key={barber.id} style={{ margin: '10px 0', width:'350px' }}
                className="show_barber" onClick={() => displayOneBarber(barber.id)}>
                    <Card.Img variant="top" src={barber.user.profile_photo} height='250em' />
                    <Card.Body>
                        <Card.Title>{barber.user.name}</Card.Title>
                        <Card.Text>
                            <span>Salon: {barber.salon_name}</span> <br/>
                            <span>Opening Hours: {barber.hour_open}</span>  <br/>
                            <span>Closing Hours: {barber.hour_close}</span>  <br/>
                            <span>Mobile: {barber.user.phone_number}</span>  <br/>
                            <span>City: {barber.user.address.length != 0 ? barber.user.address[0].city : 'Not Available'}</span>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">
                            Joined: {moment(barber.user.created_at).format('DD/MM/YYYY')}
                        </small>
                    </Card.Footer>
                </Card>
                )}
            </CardColumns>
            </Container>
        );
    }

    return (
        <div>
            <Header/>
            <h1 style={{ margin:'0 0 20px 70px', textDecoration:'underline' }}>Meet Your Barbers</h1>
            {displayBarbers()}
        </div>
    );
}
