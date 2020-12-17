import React, { useEffect, useState } from 'react';
import {useHistory, Link} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {Button, Card, CardColumns, Row, Col, ButtonGroup, Container, Image} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';
import moment from 'moment';
import '../../../css/Profile.css';

import AddSalon from './Salon/AddSalon';
import EditSalon from './Salon/EditSalon';
import SalonInfo from './Salon/SalonInfo';

import Address from './Address/Address';
import AddAddress from './Address/AddAddress';
import EditAddress from './Address/EditAddress';

import Schedule from './Private Schedule/Schedule';
import AddSchedule from './Private Schedule/AddSchedule';
import EditSchedule from './Private Schedule/EditSchedule';

import ProfileService from './BarberServices/ProfileService';

import AddGallery from './Gallery/AddGallery';

export default function Profile() {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [userInfo, setUserInfo] = useState([]);
    const [salonInfo, setSalonInfo] = useState([]);
    const [addressInfo, setAddressInfo] = useState([]);
    const [scheduleInfo, setScheduleInfo] = useState([]);
    const [barberServiceInfo, setBarberServiceInfo] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState([]);
    const history = useHistory();

    const [showAddSalon, setShowAddSalon] = useState(false);
    const handleShowAddSalon = () => setShowAddSalon(true);
    const [showEditSalon, setShowEditSalon] = useState(false);
    const handleShowEditSalon = () => setShowEditSalon(true);

    const [showAddAddress, setShowAddAddress] = useState(false);
    const handleShowAddAddress = () => setShowAddAddress(true);
    const [showEditAddress, setShowEditAddress] = useState(false);
    const handleShowEditAddress = () => setShowEditAddress(true);

    const [showAddSchedule, setShowAddSchedule] = useState(false);
    const handleShowAddSchedule = () => setShowAddSchedule(true);
    const [showEditSchedule, setShowEditSchedule] = useState(false);
    const handleShowEditSchedule = () => setShowEditSchedule(true);

    const [showAddGallery, setShowAddGallery] = useState(false);
    const handleShowAddGallery = () => setShowAddGallery(true);

    useEffect(() => {
        getUserDetails();
        getSalonInfo();
        if (salonInfo) {
            getAddressInfo();
            getScheduleInfo();
            getServicesDetails();
            getGalleryInfo();
        }
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
        }).catch(error => {
        });
    }

    function deleteProfileHandler() {
        let confirm_delete = confirm('Delete profile permanently?');
        if (confirm_delete == true) {
            api.deleteProfile(userInfo.id).then(response => {
                CookieService.remove('access_token');
                history.push('/login');
            })
        }
    }

    //Salon
    function getSalonInfo() {
        api.getSalonInfo()
        .then(response => {
            setSalonInfo(response.data[0]);
        });
    }

    function displayAddSalon(showAddSalon) {
        return(
            <AddSalon props={showAddSalon} setShow={setShowAddSalon} />
            //useState is now shared between Profile and AddSalon components
        );
    }

    function handleSalonDisable() {
        if(salonInfo.length == 0)
            return false;
        else
            return true;
    }

    function displayEditSalon() {
        return(
            <EditSalon props={showEditSalon} info={salonInfo} setShow={setShowEditSalon} />
        );
    }

    //Address
    function getAddressInfo() {
        api.getAddress()
        .then(response => {
            setAddressInfo(response.data[0]);
        });
    }

    function displayAddAddress(showAddAddress) {
        return(
            <AddAddress props={showAddAddress} setShow={setShowAddAddress} />
        );
    }

    function handleAddressDisable () {
        if(!addressInfo)
            return false;
        else
        return true;
    }

    function displayEditAddress() {
        return(
            <EditAddress props={showEditAddress} info={addressInfo} setShow={setShowEditAddress} />
        );
    }

    //Schedule
    function getScheduleInfo() {
        api.getSchedule()
        .then(response => {
            console.log(response.data);
            setScheduleInfo(response.data);
        }).catch(error => {

        });
    }

    function displayAddSchedule(showAddSchedule) {
        return(
            <AddSchedule props={showAddSchedule} setShow={setShowAddSchedule} />
        );
    }

    function handleScheduleDisable () {
        if(!scheduleInfo)
            return false;
        else
        return true;
    }

    function displayEditSchedule() {
        return(
            <EditSchedule props={showEditSchedule} info={scheduleInfo} setShow={setShowEditSchedule} />
        );
    }

    //Services
    function getServicesDetails() {
        api.getBarberService()
        .then(response => {
            console.log(response.data);
            setBarberServiceInfo(response.data);
            let servicesByBarber = [];
            response.data.forEach(barberService => {
                servicesByBarber.push(barberService.service.id);
                localStorage.setItem('services_by_barber', JSON.stringify(servicesByBarber)); //this will be used later in Service.js
            })
        }).catch(error => {

        })
    }

    //Gallery
    function getGalleryInfo() {
        api.getGalleries()
        .then(response => {
            // console.log(response.data);
            setGalleryInfo(response.data);
        }).catch(error => {

        });
    }

    function displayAddGallery() {
        return(
            <AddGallery props={showAddGallery} setShow={setShowAddGallery} />
        );
    }

    function deleteGalleryHandler(id) {
        let confirm_delete = confirm('Delete gallery?');
        if (confirm_delete == true) {
            api.deleteGallery(id).then(response => {
                window.location.reload();
            })
        }
    }

    function displayProfileInfo() {
        return (
            <Col lg={4}>
                <Card style={{ marginLeft:'10px' }}>
                    <Card.Img src={`/Images/userImage/${userInfo.profile_photo}`} alt="profile photo"/>
                    <Card.Body>
                        <Card.Title>
                            {userInfo.name}
                            <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                <Button href={`/profile/${userInfo.id}/edit`} className='edit_profile'>
                                Edit
                                </Button>
                                <Button onClick={() => {deleteProfileHandler()}}>
                                Delete
                                </Button>
                            </ButtonGroup>
                        </Card.Title>
                        <br/>
                        <Card.Text>
                            Email: &nbsp;<span>{userInfo.email}</span> <br/>
                            Phone Number: &nbsp;<span>{userInfo.phone_number}</span> <br/>
                            Joined: &nbsp;<span>{moment(userInfo.created_at).format('DD/MM/YYYY')}</span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    function displayBarberSection() {
        return (
            <>
                <Col>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Salon Information
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            <Button
                                            // disabled = {() => handleSalonDisable()}
                                            onClick = {() => handleShowAddSalon()}>
                                                Add
                                            </Button>
                                            {showAddSalon ? displayAddSalon(showAddSalon) : ''}
                                                {/**to alternate between showing the model and closing it */}
                                            <Button onClick = {() => handleShowEditSalon()}>
                                                Edit
                                            </Button>
                                            {showEditSalon ? displayEditSalon(showEditSalon) : ''}
                                            {/**to alternate between showing the model and closing it */}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {salonInfo ? <SalonInfo props={salonInfo}/> : 'Nothing yet' }
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Location
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            <Button
                                            // disabled = {() => handleAddressDisable()}
                                            onClick = {() => handleShowAddAddress()}>
                                                Add
                                            </Button>
                                            {showAddAddress ? displayAddAddress(showAddAddress) : ''}
                                            <Button onClick = {() => handleShowEditAddress()}>
                                                Edit
                                            </Button>
                                            {showEditAddress ? displayEditAddress(showEditAddress) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {addressInfo ? <Address props={addressInfo} /> : 'Nothing Yet'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Private Schedule
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            <Button
                                            // disabled = {() => handleScheduleDisable()}
                                            onClick = {() => handleShowAddSchedule()}>
                                                Add
                                            </Button>
                                            {showAddSchedule ? displayAddSchedule(showAddSchedule) : ''}
                                            <Button onClick = {() => handleShowEditSchedule()}>
                                                Edit
                                            </Button>
                                            {showEditSchedule ? displayEditSchedule(showEditSchedule) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {scheduleInfo.length != 0 ? <Schedule props={scheduleInfo} /> : 'Nothing Yet'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Services
                                        <Card.Link href="/profile/services" className="card_link">
                                            <Button style={{ marginLeft: '20px' }}>Manage Your Services</Button>
                                        </Card.Link>
                                    </Card.Title>
                                    <Card.Text>
                                        {barberServiceInfo ? <ProfileService /> : 'Nothing Yet'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Row style={{ margin:'20px 0' }}>
                    <Col lg={12}>
                        <Card style={{ marginLeft:'10px' }}>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                <h2 style={{ margin: '20px 0 0 40px' }}>Gallery</h2>
                                <Button onClick={() => handleShowAddGallery()}
                                style={{ margin:'25px 0 0 20px' }}>
                                    Upload Photo
                                </Button>
                                {showAddGallery ? displayAddGallery(showAddGallery) : ''}
                            </div>
                            <CardColumns style={{ padding:'30px 40px' }}>
                            {galleryInfo ? galleryInfo.map(gallery => {
                               return(
                                   <Card key={gallery.id} style={{ marginBottom:'20px' }}>
                                    <Card.Img src={`/Images/barberGallery/${gallery.image}`} height="300px"/>
                                    <Card.Body>
                                        <Card.Title>
                                            <Button onClick={() => {deleteGalleryHandler(gallery.id)}}>Delete</Button>
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                               )
                            }) : 'No Photos Yet'}
                            </CardColumns>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }

    function checkRole() {
        if(userInfo.roles == 'Barber') {
            return displayBarberSection();
        }
        return '';
    }

    return (
        <>
            <Header/>
            <Container fluid>
                <Row>
                    {displayProfileInfo()}
                    {userInfo ? checkRole() : ''}
                </Row>
            </Container>
        </>
    );
}
