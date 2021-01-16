import React, { useEffect, useRef, useState } from 'react';
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

import CustomerAddress from './CustomerAddress/CustomerAddress';
import AddCustomerAddress from './CustomerAddress/AddCustomerAddress';
import EditCustomerAddress from './CustomerAddress/EditCustomerAddress';

import Schedule from './Private Schedule/Schedule';
import AddSchedule from './Private Schedule/AddSchedule';
import EditSchedule from './Private Schedule/EditSchedule';

import ProfileService from './BarberServices/ProfileService';

import AddGallery from './Gallery/AddGallery';

import images from '../New Chat/Themes/Images';

export default function Profile() {
    let refInput;
    const [userInfo, setUserInfo] = useState([]);
    const [salonInfo, setSalonInfo] = useState([]);
    const [addressInfo, setAddressInfo] = useState([]);
    const [scheduleInfo, setScheduleInfo] = useState([]);
    const [barberServiceInfo, setBarberServiceInfo] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState([]);
    const [customerAddress, setCustomerAddress] = useState([]);
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

    const [showAddCustomerAddress, setShowAddCustomerAddress] = useState(false);
    const handleShowAddCustomerAddress = () => setShowAddCustomerAddress(true);
    const [showEditCustomerAddress, setShowEditCustomerAddress] = useState(false);
    const handleShowEditCustomerAddress = () => setShowEditCustomerAddress(true);

    const role = localStorage.getItem('role');

    useEffect(() => {
        getUserDetails();
        if(role =='Barber') {
            getSalonInfo();
            if (salonInfo) {
                getAddressInfo();
                getScheduleInfo();
                getServicesDetails();
                getGalleryInfo();
            }
        } else if(role == 'Customer') {
            getCustomerAddressInfo();
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

    //Customer Address
    function getCustomerAddressInfo() {
        api.getCustomerAddress()
        .then(response => {
            setCustomerAddress(response.data[0]);
        });
    }

    function displayAddCustomerAddress(showAddCustomerAddress) {
        return(
            <AddCustomerAddress props={showAddCustomerAddress} setShow={setShowAddCustomerAddress} />
        );
    }

    function displayEditCustomerAddress() {
        return(
            <EditCustomerAddress props={showEditCustomerAddress} info={customerAddress} setShow={setShowEditCustomerAddress} />
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

    function onChangeProfilePhoto(event) {
        if (event.target.files && event.target.files[0]) {
            // Check this file is an image
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') !== 0) {
                alert('This file is not an image');
                document.getElementById('input_file').value = '';
                return
            }
        } else {
            alert('Something wrong with input file');
        }

        const formData = new FormData();
        formData.append('profile_photo', event.target.files[0]);

        api.updateProfilPhoto(formData, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}})
        .then(response => {
            window.location.reload();
        })
    }

    function displayProfileInfoBarber() {
        return (
            <>
                <Col lg={4}>
                    <Card style={{ marginLeft:'15px', height:'601px' }} className="profile_card">
                        <Card.Img src={userInfo.profile_photo} alt="profile photo" height="350px"/>
                        <div className="viewWrapInputFile">
                            <img
                                className="imgInputFile"
                                alt="icon gallery"
                                src={images.ic_input_file}
                                onClick={() => refInput.click()}
                            />
                            <input
                                ref={el => {
                                    refInput = el
                                }}
                                accept="image/*"
                                className="viewInputFile"
                                id="input_file"
                                type="file"
                                onChange={onChangeProfilePhoto}
                            />
                        </div>
                        <Card.Body>
                            <Card.Title className="profile_subheaders">
                                {userInfo.name}
                                <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                    <Button className="edit_profile profile_btn"
                                    onClick={() => handleShowEditProfile()}>
                                    Edit
                                    </Button>

                                    {showEditProfile ? displayEditProfile(showEditProfile) : ''}

                                    <Button className="profile_btn" onClick={() => {deleteProfileHandler()}}
                                    style={{ borderLeft:'1px solid #00356f' }}>
                                    Delete
                                    </Button>
                                </ButtonGroup>
                            </Card.Title>
                            <Card.Text>
                                <span className="profile_spans"><u>Email:</u> {userInfo.email}</span> <br/>
                                <span className="profile_spans"><u>Phone Number:</u> {userInfo.phone_number} </span><br/>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">
                                Joined: &nbsp;<span>{moment(userInfo.created_at).format('DD/MM/YYYY')}</span>
                            </small>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Row>
                        <Col lg={6}>
                            <Card className="profile_card" style={{ height:'210px' }}>
                                <Card.Body>
                                    <Card.Title className="profile_subheaders">
                                        Salon Information
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>

                                            {!salonInfo ?
                                                <Button className="profile_btn"
                                                onClick = {() => handleShowAddSalon()}>
                                                    Add
                                                </Button>
                                                : ''}

                                            {showAddSalon ? displayAddSalon(showAddSalon) : ''}
                                                {/**to alternate between showing the model and closing it */}

                                            {salonInfo ?
                                                <Button className="profile_btn"
                                                onClick = {() => handleShowEditSalon()}>
                                                    Edit
                                                </Button>
                                            : ''}
                                            {showEditSalon ? displayEditSalon(showEditSalon) : ''}
                                            {/**to alternate between showing the model and closing it */}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {salonInfo ? <SalonInfo props={salonInfo}/> : <span className="nothing">Nothing yet</span> }
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card style={{ height:'100%' }} className="profile_card">
                                <Card.Body>
                                    <Card.Title className="profile_subheaders">
                                        Private Schedule
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            {scheduleInfo.length == 0 ?
                                            <Button className="profile_btn"
                                            onClick = {() => handleShowAddSchedule()}>
                                                Add
                                            </Button>
                                            : ''}
                                            {showAddSchedule ? displayAddSchedule(showAddSchedule) : ''}

                                            {scheduleInfo.length != 0 ?
                                                <Button className="profile_btn"
                                                onClick = {() => handleShowEditSchedule()}>
                                                    Edit
                                                </Button>
                                            : ''}

                                            {showEditSchedule ? displayEditSchedule(showEditSchedule) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {scheduleInfo.length != 0 ? <Schedule props={scheduleInfo} />
                                        : <span className="nothing">Nothing yet</span>}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col lg={6}>
                            <Card style={{ height:'367px' }} className="profile_card">
                                <Card.Body>
                                    <Card.Title className="profile_subheaders">
                                        Location
                                        <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                            {!addressInfo ?
                                                <Button className="profile_btn"
                                                onClick = {() => handleShowAddAddress()}>
                                                    Add
                                                </Button>
                                            : ''}

                                            {showAddAddress ? displayAddAddress(showAddAddress) : ''}

                                            {addressInfo ?
                                                <Button className="profile_btn"
                                                onClick = {() => handleShowEditAddress()}>
                                                    Edit
                                                </Button>
                                            : ''}
                                            {showEditAddress ? displayEditAddress(showEditAddress) : ''}
                                        </ButtonGroup>
                                    </Card.Title>
                                    <Card.Text>
                                        {addressInfo ? <Address props={addressInfo} /> : <span className="nothing">Nothing yet</span>}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card style={{ height:'367px' }} className="profile_card">
                                <Card.Body>
                                    <Card.Title className="profile_subheaders">
                                        Services
                                        <Card.Link href="/profile/services" className="card_link">
                                            <Button className="profile_btn"
                                            style={{ marginLeft: '20px' }}>
                                                Manage Your Services
                                            </Button>
                                        </Card.Link>
                                    </Card.Title>
                                    {barberServiceInfo.length == 0 ?
                                    <span className="nothing">
                                        Nothing yet. Services are needed so the customer can browse for you information
                                        and book an appointment with you
                                    </span>
                                    : ''}
                                </Card.Body>
                                {barberServiceInfo.length != 0 ? <ProfileService /> : ''}
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Row style={{position:'absolute', top:'740px' , right:'15px', left:'30px', paddingBottom:'20px' }} >
                    <Col lg={12}>
                        <Card className="profile_galleryCard">
                            <div style={{ display:'flex', alignItems:'center' }}>
                                <h2 style={{ margin: '20px 0 0 40px' }} className="profile_subheaders">
                                    Gallery
                                </h2>
                                <Button className="profile_btn" onClick={() => handleShowAddGallery()}
                                style={{ margin:'25px 0 0 20px' }}>
                                    Upload Photo
                                </Button>
                                {showAddGallery ? displayAddGallery(showAddGallery) : ''}
                            </div>
                            <CardColumns as={Row} style={{ marginLeft:'30px', width:'1270px' }}>
                            {galleryInfo.length !=0 ? galleryInfo.map(gallery => {
                            return(
                                <Card key={gallery.id} style={{width:'350px', margin:'20px 50px 20px 10px' }} lg={4}
                                 className="profile_card">
                                    <Card.Img src={gallery.image} height="300px"/>
                                    <Card.Body>
                                        <Card.Title>
                                            <Button className="profile_btn"
                                            onClick={() => {deleteGalleryHandler(gallery.id)}}>
                                                Delete
                                            </Button>
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                            )
                            }) : <span style={{  marginLeft: '12px', marginTop:'20px' }} className="nothing">No Photos yet</span>}
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
                <Row>
                    <Col lg={4}>
                        <Card style={{ marginLeft:'15px' }} className="profile_card">
                            <Card.Img src={userInfo.profile_photo} alt="profile photo" height="300px" />
                            <div className="viewWrapInputFile">
                                <img
                                    className="imgInputFile"
                                    alt="icon gallery"
                                    src={images.ic_input_file}
                                    onClick={() => refInput.click()}
                                />
                                <input
                                    ref={el => {
                                        refInput = el
                                    }}
                                    accept="image/*"
                                    className="viewInputFile"
                                    type="file"
                                    id="input_file"
                                    onChange={onChangeProfilePhoto}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title className="profile_subheaders">
                                    {userInfo.name}
                                    <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                        <Button className="edit_profile profile_btn"
                                        onClick={() => handleShowEditProfile()}>
                                        Edit
                                        </Button>

                                        {showEditProfile ? displayEditProfile(showEditProfile) : ''}

                                        <Button className="profile_btn"
                                        onClick={() => {deleteProfileHandler()}}
                                        style={{ borderLeft:'1px solid #00356f' }}>
                                        Delete
                                        </Button>
                                    </ButtonGroup>
                                </Card.Title>
                                <Card.Text>
                                    <span className="profile_spans"><u>Email:</u> {userInfo.email}</span> <br/>
                                    <span className="profile_spans"><u>Phone Number:</u> {userInfo.phone_number}</span> <br/>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">
                                    Joined: &nbsp;<span>{moment(userInfo.created_at).format('DD/MM/YYYY')}</span>
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card style={{ height:'507px' }} className="profile_card">
                            <Card.Body>
                                <Card.Title className="profile_subheaders">
                                    Location
                                    <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                        {!customerAddress ?
                                            <Button className="profile_btn"
                                            onClick = {() => handleShowAddCustomerAddress()}>
                                                Add
                                            </Button>
                                        : ''}

                                        {showAddCustomerAddress ? displayAddCustomerAddress(showAddCustomerAddress) : ''}

                                        {customerAddress ?
                                            <Button className="profile_btn"
                                            onClick = {() => handleShowEditCustomerAddress()}>
                                                Edit
                                            </Button>
                                        : ''}
                                        {showEditCustomerAddress ? displayEditCustomerAddress(showEditCustomerAddress) : ''}
                                    </ButtonGroup>
                                    <br/> <br/>
                                    <small style={{ fontSize:'16px' }} className="text-muted">
                                        Your address information is needed in case you wish to request an appointment
                                        at your <strong>Home</strong>.<br/>
                                        It will be shared with your barber.
                                    </small>
                                </Card.Title>
                                <Card.Text>
                                    {customerAddress ? <CustomerAddress props={customerAddress} />
                                    : <span className="nothing">Nothing yet</span>}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
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
