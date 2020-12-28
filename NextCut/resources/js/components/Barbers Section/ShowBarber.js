import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import api from '../../api';
import {Card, Col, Container, Row, CardColumns, Button} from 'react-bootstrap';
import moment from 'moment';
import '../../../css/Barber.css';
import BarberSchedule from './BarberSchedule';
import Gallery from '../Gallery';

export default function ShowBarber(props) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const param = useParams();
    const [barberDetails, setBarberDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [addressDetails, setAddressDetails] = useState([]);
    const [services, setServices] = useState([]);
    const [barberService, setBarberService] = useState([]);
    const [openHours, setOpenHours] = useState([]);
    const [closeHours, setCloseHours] = useState([]);
    const [barberSchedule, setBarberSchedule] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState([]);

    const [showGallerySlideShow, setShowGallerySlideShow] = useState(false);
    const handleShowGallerySlideShow = () => setShowGallerySlideShow(true);

    useEffect(() => {
        getBarberDetails();
        getServices();
        getBarberSchedule();
        getGalleryInfo();
    }, []);

    function getBarberDetails() {
        api.getOneBarber(param.id)
        .then(response => {
            setBarberDetails(response.data);
            setUserDetails(response.data.user);
            setAddressDetails(response.data.user.address[0]);
            setOpenHours(response.data.salon_open);
            setCloseHours(response.data.salon_close);
        });
    }

    function getServices() {
        api.getBarberServices(param.id)
        .then(response => {
            setServices(response.data.service);
            setBarberService(response.data.barber_service);
        }).catch(error => {

        });
    }

    function getBarberSchedule() {
        api.getBarberSchedule(param.id)
        .then(response => {
            // console.log(response.data);
            setBarberSchedule(response.data);
        }).catch(error => {

        });
    }

    function getGalleryInfo() {
        api.getBarberGallery(param.id)
        .then(response => {
            // console.log(response.data);
            setGalleryInfo(response.data);
        }).catch(error => {

        });
    }

    function displayGallerySlideShow() {
        return (
            <Gallery props={showGallerySlideShow} info={param.id} setShow={setShowGallerySlideShow}/>
        )
    }

    function displayBarberDetails() {
        return(
            <Container fluid>
                <Row>
                    <Col lg={4} sm>
                        <Card key={barberDetails.id}>
                            <Card.Img variant="top" src={userDetails.profile_photo}
                            height='350px' />
                            <Card.Body>
                                <Card.Title>{userDetails.name}</Card.Title>
                                <Card.Text>
                                    <span>Salon Name: {barberDetails.salon_name}</span> <br/>
                                    <span className="barber_header">Schedule</span> <br/>
                                    <span>From {barberDetails.day_open} to {barberDetails.day_close}: </span><br/>
                                    <span>Opening Hours: {barberDetails.hour_open}</span> <br/>
                                    <span>Closing Hours: {barberDetails.hour_close}</span> <br/>
                                    <span className="barber_header">Location</span> <br/>
                                    {addressDetails ?
                                    <>
                                        <span>City: {addressDetails.city}</span> <br/>
                                        <span>Street: {addressDetails.street}</span> <br/>
                                        <span>Building: {addressDetails.building}</span> <br/>
                                        <span>Near: {addressDetails.near}</span> <br/>
                                    </>
                                    :
                                    <>
                                        <span>Address Not Available</span> <br/>
                                    </>}

                                    <span className="barber_header">Contact</span> <br/>
                                    <span>Mobile: {userDetails.phone_number}</span>  <br/>
                                    <span>Email: {userDetails.email}</span>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">
                                    Joined: {moment(userDetails.created_at).format('DD/MM/YYYY')}
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Row>
                            <Col lg={7}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title className="card_title">Services</Card.Title>
                                        <Card.Text>
                                            <Row>
                                                <Col>
                                                    <span className='service_header'>Type</span>
                                                    {services.length != 0 ? services.map(service =>
                                                        <li key={service.id} className="service">
                                                            {service.type}
                                                        </li>
                                                    )
                                                    :
                                                    <>
                                                        <br/>
                                                        <span>Not Availabe</span>
                                                    </> }
                                                </Col>
                                                <Col>
                                                    <span className='service_header'>Price</span>
                                                    {barberService.length != 0 ? barberService.map(service =>
                                                        <li key={service.id} className="service">
                                                            {service.price}$
                                                        </li>
                                                    )
                                                    :
                                                    <>
                                                        <br/>
                                                        <span>Not Availabe</span>
                                                    </> }
                                                </Col>
                                                <Col>
                                                    <span className='service_header'>Time</span>
                                                    {barberService.length != 0 ? barberService.map(service =>
                                                        <li key={service.id} className="service">
                                                            {service.estimated_time} mins
                                                        </li>
                                                    )
                                                    :
                                                    <>
                                                        <br/>
                                                        <span>Not Availabe</span>
                                                    </> }
                                                </Col>
                                            </Row>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={5}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title  className="card_title">Private Schedule</Card.Title>
                                        <Card.Text>
                                            {barberSchedule ? <BarberSchedule props={barberSchedule} /> : ''}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <small>Last Updated: {moment(barberSchedule.last_updated).format('DD/MM/YYYY')}</small>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <h2 style={{ margin: '20px 0 0 20px' }}>Gallery</h2>
                                    <CardColumns style={{ padding:'20px 20px 0 20px' }}>
                                    {galleryInfo.length != 0 ? galleryInfo.map((gallery) => {
                                    return(
                                        <Card key={gallery.id} style={{ marginBottom:'20px' }}
                                        className="clickable_photos"
                                        onClick={() => handleShowGallerySlideShow(galleryInfo)}>
                                            <Card.Img src={gallery.image} height="250px"/>
                                        </Card>
                                    )
                                    })
                                    :
                                    <>
                                        <span>Not Available</span>
                                    </>}
                                    </CardColumns>
                                </Card>
                            </Col>
                        </Row>
                        {showGallerySlideShow ? displayGallerySlideShow(showGallerySlideShow) : ''}
                        <br/>
                        <Row>
                            <Col>
                                {localStorage.getItem('role') != 'Barber' ?
                                <Button size='lg' href={`/booking/${barberDetails.id}`}>
                                    Book This Barber
                                </Button>
                                : ''}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <Header/>
            {displayBarberDetails()}
        </>
    );
}
