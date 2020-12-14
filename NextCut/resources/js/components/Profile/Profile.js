import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {Button, Card, Row, Col, ButtonGroup, Container} from 'react-bootstrap';
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

export default function Profile() {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [userInfo, setUserInfo] = useState([]);
    const [salonInfo, setSalonInfo] = useState([]);
    const [addressInfo, setAddressInfo] = useState([]);
    const [scheduleInfo, setScheduleInfo] = useState([]);
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

    useEffect(() => {
        getUserDetails();
        getSalonInfo();
        getAddressInfo();
        getScheduleInfo();
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

    function displayImage() {
        return (
            <Container fluid>
                <Row>
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
                    <Col>
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            Salon Information
                                            <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                                <Button disabled = {handleSalonDisable()}
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
                                            {salonInfo.length != 0 ? <SalonInfo props={salonInfo}/> : 'Nothing yet' }
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
                                                <Button disabled = {handleAddressDisable()}
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
                                                <Button disabled = {handleScheduleDisable()}
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
                                            {scheduleInfo ? <Schedule props={scheduleInfo} /> : 'Nothing Yet'}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            Services
                                            <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                                <Button>
                                                    Add
                                                </Button>
                                                <Button>
                                                    Edit
                                                </Button>
                                            </ButtonGroup>
                                        </Card.Title>
                                        <Card.Text>
                                            Something
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
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
            {displayImage()}
        </>
    );
}
