import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Header from '../Header';
import CookieService from '../../Service/CookieService';
import api from '../../api';
import {Card, Col, Container, Row, CardColumns, Button, Table} from 'react-bootstrap';
import moment from 'moment';
import '../../../css/Barber.css';
import BarberSchedule from './BarberSchedule';
import Gallery from './Gallery';

export default function ShowBarber(props) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const param = useParams();
    const [barberDetails, setBarberDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [addressDetails, setAddressDetails] = useState([]);;
    const [barberService, setBarberService] = useState([]);
    const [openHours, setOpenHours] = useState([]);
    const [closeHours, setCloseHours] = useState([]);
    const [barberSchedule, setBarberSchedule] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState([]);
    const [activeIdx, setActiveIdx] = useState();

    const [showGallerySlideShow, setShowGallerySlideShow] = useState(false);
    const handleShowGallerySlideShow = (index) => {
        setShowGallerySlideShow(true)
        setActiveIdx(index);
    };

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
            setBarberService(response.data);
        }).catch(error => {

        });
    }

    function getBarberSchedule() {
        api.getBarberSchedule(param.id)
        .then(response => {
            if(Object.keys(response.data).length == 0) {
                // console.log('empty')
            }else {
                setBarberSchedule(response.data);;
            }
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
            <Gallery props={showGallerySlideShow} info={param.id} index={activeIdx} setShow={setShowGallerySlideShow}/>
        )
    }

    function displayBarberDetails() {
        return(
            <Container fluid>
                <Row>
                    <Col lg={4} xs>
                        <Card key={barberDetails.id} className="onebarber_card">
                            <Card.Img variant="top" src={userDetails.profile_photo}
                            height='350px' />
                            <Card.Body>
                                <Card.Title style={{ fontSize:'21px', color:'#DAA520' }}>{userDetails.name}</Card.Title>
                                <Card.Text>
                                    <span className="onebarber_info"><u>Salon Name:</u> {barberDetails.salon_name}</span> <br/>
                                    <span className="onebarber_info" style={{ color:'#DAA520', fontSize: '21px'}}>Salon Schedule</span> <br/>
                                    <span className="onebarber_info"><u>Opening Hours:</u> {barberDetails.hour_open}</span> <br/>
                                    <span className="onebarber_info"><u>Closing Hours:</u> {barberDetails.hour_close}</span> <br/>
                                    <span className="onebarber_info"><u>From:</u> {barberDetails.day_open}</span><br/>
                                    <span className="onebarber_info"><u>To:</u> {barberDetails.day_close}</span> <br/>
                                    <span className="onebarber_info" style={{ color:'#DAA520', fontSize: '21px'}}>Location</span> <br/>
                                    {addressDetails ?
                                    <>
                                        <span className="onebarber_info"><u>City:</u> {addressDetails.city}</span> <br/>
                                        <span className="onebarber_info"><u>Street:</u> {addressDetails.street}</span> <br/>
                                        <span className="onebarber_info"><u>Building:</u> {addressDetails.building}</span> <br/>
                                        <span className="onebarber_info"><u>Near:</u> {addressDetails.near}</span> <br/>
                                    </>
                                    :
                                    <>
                                        <span style={{ color:'#00356f' }}>Address Not Available</span> <br/>
                                    </>}

                                    <span className="onebarber_info" style={{ color:'#DAA520', fontSize: '21px'}}>Contact</span> <br/>
                                    <span className="onebarber_info"><u>Mobile:</u> {userDetails.phone_number}</span>  <br/>
                                    <span className="onebarber_info"><u>Email:</u> {userDetails.email}</span>
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
                            <Col lg={6} xs={12}>
                                <Card style={{ height:'250px' }} className="service_card">
                                    <Card.Body>
                                        <Card.Title style={{ paddingTop: '15px', position:'absolute', left:'13px', top:'5px' }} className="card_title">Services</Card.Title>
                                    </Card.Body>
                                    <br/>
                                    <div className="div_table">
                                            <Table className="table_barber" hover bordered>
                                                <thead>
                                                    <tr>
                                                        <th className="onebarber_thd">Type</th>
                                                        <th className="onebarber_thd">Price</th>
                                                        <th className="onebarber_thd">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {barberService.length != 0 ?
                                                    barberService.map(barber_service => {
                                                        return (
                                                            <tr key={barber_service.id}>
                                                                <td className="onebarber_thd">{barber_service.service.type}</td>
                                                                <td className="onebarber_thd">{barber_service.price}</td>
                                                                <td className="onebarber_thd">{barber_service.estimated_time}</td>
                                                            </tr>
                                                        );
                                                    })
                                                    :   <tr><td colSpan="3" style={{color: '#00356f'}}>
                                                            Not Available
                                                        </td></tr>}
                                                </tbody>
                                            </Table>
                                        </div>
                                </Card>
                            </Col>
                            <Col lg={6} xs={12}>
                                <Card style={{ height:'250px' }} className="onebarber_card">
                                    <Card.Body>
                                        <Card.Title  className="card_title">Private Schedule</Card.Title>
                                        <Card.Text>
                                            {barberSchedule ? <BarberSchedule props={barberSchedule} /> :  <span style={{ color:'#00356f' }}>Not Available</span>}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <small>Last Updated: {moment(barberSchedule.last_updated).format('DD/MM/YYYY')}</small>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                        <Row style={{ position:'absolute', top:'270px', right:'15px', left:'15px' }}>
                        <Col lg={12} xs={12}>
                                <Card className="gallery_card">
                                    <h4 style={{ margin: '20px 0 0 20px', color:'#DAA520', fontSize:'24px' }}>
                                        Gallery
                                    </h4>
                                    <CardColumns as={Row} style={{ width:'850px', marginLeft:'20px', marginTop:'10px'}}>
                                        {galleryInfo.length != 0 ? galleryInfo.map((gallery, index) => {
                                        return(
                                            <Card key={gallery.id} lg={3} style={{width:'250px', marginRight:'20px' }}
                                            className="clickable_photos"
                                            onClick={() => handleShowGallerySlideShow(index)}>
                                                <Card.Img src={gallery.image} height="190px"/>
                                            </Card>
                                        )
                                        })
                                        :
                                        <>
                                            <span style={{ color:'#00356f' }}>Not Available</span>
                                        </>}
                                    </CardColumns>
                                </Card>
                            </Col>
                        </Row>
                        {showGallerySlideShow ? displayGallerySlideShow(showGallerySlideShow) : ''}
                        <br/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {localStorage.getItem('role') == 'Customer' ?
                        <Button className="onebarber_btn" size='lg'
                        href={`/booking/${barberDetails.id}`} style={{ marginTop:'20px' }}>
                            Book This Barber
                        </Button>
                        : ''}
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <Header/>
            <br/>
            {displayBarberDetails()}
        </>
    );
}
