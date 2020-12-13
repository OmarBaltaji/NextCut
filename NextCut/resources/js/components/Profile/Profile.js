import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import {Button, Card, Modal, Row, Col, ButtonGroup, Container} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';
import moment from 'moment';
import '../../../css/Profile.css';
import AddSalon from './Salon/AddSalon';

export default function Profile() {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    const [userInfo, setUserInfo] = useState([]);
    const history = useHistory();

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    useEffect(() => getUserDetails(), []);

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


    function displayAddSalon(show) {
        return(
            <AddSalon props={show} setShow={setShow} /> //useState is now shared between Profile and AddSalon components
        );
    }

    function displayImage() {
        return (
            <Container fluid>
                <Row lg={12}>
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
                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    Salon Schedule
                                    <ButtonGroup style={{ position:'relative', left:'10px' }}>
                                        <Button onClick = {() => handleShow()}>
                                            Add
                                        </Button>
                                        {show ? displayAddSalon(show) : ''} {/**to alternate between showing the model and closing it */}
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
                        <br/>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    Private Schedule
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
                    <Col lg={4}>
                    <Card>
                            <Card.Body>
                                <Card.Title>
                                    Location
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
                        <br/>
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
