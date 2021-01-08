import React, { useEffect, useState } from 'react';
import {useHistory, Link} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {Button, Card, CardColumns, Row, Col, ButtonGroup, Container} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';
import moment from 'moment';
import '../../../css/Profile.css';

import EditProfile from './EditProfile';

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

    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [userInfo, setUserInfo] = useState([]);
    const [salonInfo, setSalonInfo] = useState([]);
    const [addressInfo, setAddressInfo] = useState([]);
    const [scheduleInfo, setScheduleInfo] = useState([]);
    const [barberServiceInfo, setBarberServiceInfo] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState([]);
    const history = useHistory();

    const [showEditProfile, setShowEditProfile] = useState(false);
    const handleShowEditProfile = () => setShowEditProfile(true);

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
            if(error.response.status == 401) {
                history.push('/home')
            }
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

    function displayEditProfile() {
        return(
            <EditProfile props={showEditProfile} info={userInfo} setShow={setShowEditProfile} />
        );
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

    function displayEditAddress() {
        return(
            <EditAddress props={showEditAddress} info={addressInfo} setShow={setShowEditAddress} />
        );
    }

    //Schedule
    function getScheduleInfo() {
        api.getSchedule()
        .then(response => {
            setScheduleInfo(response.data);
        }).catch(error => {

        });
    }

    function displayAddSchedule(showAddSchedule) {
        return(
            <AddSchedule props={showAddSchedule} setShow={setShowAddSchedule} />
        );
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
            setBarberServiceInfo(response.data);
            let servicesByBarber = [];
            response.data.forEach(barberService => {
                servicesByBarber.push(barberService.service.id);
                localStorage.setItem('services_by_barber', JSON.stringify(servicesByBarber));
                //this will be used later in Service.js
            })
        }).catch(error => {

        })
    }

    //Gallery
    function getGalleryInfo() {
        api.getGalleries()
        .then(response => {
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

    function displayProfileInfoBarber() {
        return (
            <>
                <Col lg={4}>
                    <Card style={{ marginLeft:'15px' }}>
                        <Card.Img src={userInfo.profile_photo} alt="profile photo"/>
                        <Card.Body>
                            <Card.Title>
                                {userInfo.name}
                                <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                    <Button onClick={() => handleShowEditProfile()} className='edit_profile'>
                                    Edit
                                    </Button>

                                    {showEditProfile ? displayEditProfile(showEditProfile) : ''}

                                    <Button onClick={() => {deleteProfileHandler()}}>
                                    Delete
                                    </Button>
                                </ButtonGroup>
                            </Card.Title>
                            <Card.Text>
                                Email: &nbsp;<span>{userInfo.email}</span> <br/> <br/>
                                Phone Number: &nbsp;<span>{userInfo.phone_number}</span> <br/> <br/>
                                Joined: &nbsp;<span>{moment(userInfo.created_at).format('DD/MM/YYYY')}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Row>
                        <Col lg={6}>
                            <Card style={{ height:'210px' }}>
                                <Card.Body>
                                    <Card.Title>
                                        Salon Information
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>

                                            {!salonInfo ?
                                                <Button
                                                onClick = {() => handleShowAddSalon()}>
                                                    Add
                                                </Button>
                                                : ''}

                                            {showAddSalon ? displayAddSalon(showAddSalon) : ''}
                                                {/**to alternate between showing the model and closing it */}

                                            {salonInfo ?
                                                <Button onClick = {() => handleShowEditSalon()}>
                                                    Edit
                                                </Button>
                                            : ''}
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
                            <Card style={{ height:'100%' }}>
                                <Card.Body>
                                    <Card.Title>
                                        Private Schedule
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            {scheduleInfo.length == 0 ?
                                            <Button
                                            onClick = {() => handleShowAddSchedule()}>
                                                Add
                                            </Button>
                                            : ''}
                                            {showAddSchedule ? displayAddSchedule(showAddSchedule) : ''}

                                            {scheduleInfo.length != 0 ?
                                                <Button onClick = {() => handleShowEditSchedule()}>
                                                    Edit
                                                </Button>
                                            : ''}

                                            {showEditSchedule ? displayEditSchedule(showEditSchedule) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {scheduleInfo.length != 0 ? <Schedule props={scheduleInfo} />
                                        : 'Nothing Yet'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col lg={6}>
                            <Card style={{ height:'367px' }}>
                                <Card.Body>
                                    <Card.Title>
                                        Location
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            {!addressInfo ?
                                                <Button
                                                onClick = {() => handleShowAddAddress()}>
                                                    Add
                                                </Button>
                                            : ''}

                                            {showAddAddress ? displayAddAddress(showAddAddress) : ''}

                                            {addressInfo ?
                                                <Button onClick = {() => handleShowEditAddress()}>
                                                    Edit
                                                </Button>
                                            : ''}
                                            {showEditAddress ? displayEditAddress(showEditAddress) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {addressInfo ? <Address props={addressInfo} /> : 'Nothing Yet'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card style={{ height:'367px' }}>
                                <Card.Body>
                                    <Card.Title>
                                        Services
                                        <Card.Link href="/profile/services" className="card_link">
                                            <Button style={{ marginLeft: '20px' }}>Manage Your Services</Button>
                                        </Card.Link>
                                    </Card.Title>
                                    {barberServiceInfo.length == 0 ? 'Nothing Yet' : ''}
                                </Card.Body>
                                {barberServiceInfo.length != 0 ? <ProfileService /> : ''}
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Row style={{position:'absolute', top:'740px' , right:'15px', left:'30px', paddingBottom:'20px' }} >
                    <Col lg={12}>
                        <Card style={{ height:'600px', overflowY:'scroll' }}>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                <h2 style={{ margin: '20px 0 0 40px' }}>Gallery</h2>
                                <Button onClick={() => handleShowAddGallery()}
                                style={{ margin:'25px 0 0 20px' }}>
                                    Upload Photo
                                </Button>
                                {showAddGallery ? displayAddGallery(showAddGallery) : ''}
                            </div>
                            <CardColumns style={{ padding:'30px 40px' }}>
                            {galleryInfo.length !=0 ? galleryInfo.map(gallery => {
                            return(
                                <Card key={gallery.id} style={{ marginBottom:'20px' }}>
                                    <Card.Img src={gallery.image} height="300px"/>
                                    <Card.Body>
                                        <Card.Title>
                                            <Button onClick={() => {deleteGalleryHandler(gallery.id)}}>
                                                Delete
                                            </Button>
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

    function displayProfileInfoCustomer() {
        return (
            <>
                <Col lg={4}>
                    <Card style={{ marginLeft:'15px' }}>
                        <Card.Img src={userInfo.profile_photo} alt="profile photo"/>
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
                            <Card.Text>
                                Email: &nbsp;<span>{userInfo.email}</span> <br/> <br/>
                                Phone Number: &nbsp;<span>{userInfo.phone_number}</span> <br/> <br/>
                                Joined: &nbsp;<span>{moment(userInfo.created_at).format('DD/MM/YYYY')}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </>
        );
    }

    function checkRole() {
        if(userInfo.roles == 'Barber') {
            return displayProfileInfoBarber();
        } else
            return displayProfileInfoCustomer();
    }

    return (
        <>
            <Header/>
            <br/>
            <Container fluid>
                <Row>
                    {userInfo ? checkRole() : ''}
                </Row>
            </Container>
        </>
    );
}
