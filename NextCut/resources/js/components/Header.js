import React, {useState, useEffect} from 'react';
import {Nav, Navbar, NavDropdown, Image, DropdownButton, Dropdown, Badge} from 'react-bootstrap';
import api from '../api';
import {useHistory} from 'react-router-dom';
import CookieService from '../Service/CookieService';
import '../../css/Head_Log_Reg.css';
import logo from '../../../public/Images/logo.png';
import moment from 'moment';
import firebase from 'firebase';
import firebaseConfig from '../Firebase/FirebaseConfig';
import 'firebase/auth';
import 'firebase/firestore';

import { messaging } from "../Firebase/init-fcm";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function(registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function(err) {
        console.log("Service worker registration failed, error:", err);
      });
}

const db = firebase.firestore();

db.settings({
timestampsInSnapshots: true
});

export default function Header() {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState([]);
    const [notificationInfo, setNotificationInfo] = useState([]);
    const [isUserNotified, setIsUserNotified] = useState(false);
    const [notificationOpened, setNotificationOpened] = useState(false);
    const cookie = CookieService.get('access_token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    let role = localStorage.getItem('role');

    useEffect(() => {
        if(cookie) {
            getUserDetails();
        }
    }, []);

    useEffect(() => {
        if(cookie) {
            getNotificationInfo(userInfo);
        }
    }, [userInfo, isUserNotified, notificationOpened])

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);

            messaging.requestPermission()
            .then(async function() {
                const token = await messaging.getToken();

                const userRef = db.collection('fcm_token').doc(token);

                userRef.set({
                    userToken: token,
                    userID: response.data.FirebaseUID,
                });
            })
            .catch(function(err) {
                console.log("Unable to get permission to notify.", err);
            });
            navigator.serviceWorker.addEventListener("message", (message) => console.log(message));

            localStorage.setItem('role', response.data.roles);
            if(response.data.roles == 'Customer') {
                api.setCustomer()
                .then(response => {
                }).catch(error => {
                    console.log('user already exist')
                });
            }
        })
    }

    function getNotificationInfo(user_details) {
        const query = db.collection('notifications').orderBy('created', 'desc');
        let count = 0;
        let notifications_list = [];


        query.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type == 'added') {
                    if(user_details.FirebaseUID == change.doc.data().toUserID) {
                        let timestamp = change.doc.data().created.toDate();
                        let notification = {};
                        notification['message'] = change.doc.data().message;
                        notification['time'] = moment(timestamp).format('lll');
                        notifications_list.push(notification);

                        if(change.doc.data().isOpened == false) {
                            count += 1;
                        }
                    }
                }
                if(change.type == 'modified') {
                    setNotificationOpened(!notificationOpened);
                }
            })
            setNotificationInfo({
                count: count,
                notifications_list: notifications_list,
            });
            if(notifications_list.length != 0) {
                setIsUserNotified(true);
            }
        })
    }

    function handleNotifications() {
        const query = db.collection('notifications');
        query.get().then(snapshot => {
            snapshot.forEach(doc => {
                if(doc.data().toUserID == userInfo.FirebaseUID) {
                    doc.ref.update({'isOpened': true});
                }
            })
        })
    }

    function logoutHandler(e) {
        e.preventDefault();
        api.logout().then(response => {
            CookieService.remove('access_token', {path: '/'});

            firebase.auth().signOut()
            .then(function() {

            }, function(error) {
                // An error happened.
            });

            window.localStorage.clear();
            messaging.deleteToken();

            history.push('/login');
            window.location.reload();
        })
    }

    function displayUser() {
        return (
            <NavDropdown style={{ marginRight: '20px' }} className="user-dropdown"
            title={userInfo.length != 0 ? userInfo.name : ''} id="collasible-nav-dropdown">
                <NavDropdown.Item style = {{ color: '#40E0D0'}} href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item style = {{ color: '#40E0D0' }} onClick={(e) => logoutHandler(e)} href='/login'>
                    Logout
                </NavDropdown.Item>
            </NavDropdown>
        );
    }

    function displayGuest() {
        return (
            <>
                <Nav.Link className='navlink' href="/login">Login</Nav.Link>
                <Nav.Link className='navlink' href="/register">Register</Nav.Link>
            </>
        );
    }

    return (
        <Navbar collapseOnSelect expand='lg' sticky="top" style={{ backgroundColor: '#DAA520' }}>
            <Navbar.Brand  href="/home">
                <Image src={logo} height="50px" width="60px"
                alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className="navlink" href="/home">Home</Nav.Link>
                    <Nav.Link className="navlink" href="/aboutus">About Us</Nav.Link>
                    <Nav.Link className="navlink" href="/barbers">Barbers</Nav.Link>

                    {userInfo.roles == 'Customer' || role == 'Customer' ?
                    <Nav.Link className="navlink" href="/booking">Book!</Nav.Link>
                    : ''}

                    {userInfo.roles == 'Barber' || role == 'Barber'?
                    <Nav.Link className="navlink" href="/requests" >Requests</Nav.Link>
                    : ''}

                </Nav>

                {cookie && (userInfo.roles == 'Barber' || role == 'Barber') ?
                <div className="dropdown-container" style={{ position: 'relative' }}>
                    <DropdownButton
                    menuAlign='right'
                    id="notification_dropdown"
                    title={
                        <>
                            <i className="far fa-bell" />
                            &nbsp;
                            <span
                            style={{ backgroundColor:'#00356f' }}>
                                <Badge style={{ color: 'white' }}>{notificationInfo.count}</Badge>
                            </span>
                        </>
                    }
                    onClick={() => handleNotifications()}
                    >
                        {notificationInfo.length != 0 ?
                        notificationInfo.notifications_list ?
                        <div style={{ height:'180px',  minWidth:'400px' }}>
                            {notificationInfo.notifications_list.map((notification, index) => {
                                return (
                                    <div key={'div'+index}>
                                        <Dropdown.Item href='/requests'  key={index}
                                        className="notification_dropItem">
                                            <span className='notif_msg'>{notification.message}</span><br/>
                                            <span className='notif_time'>
                                                {notification.time}
                                            </span>
                                        </Dropdown.Item>
                                        {index == notificationInfo.notifications_list.length - 1 ?
                                        '' :
                                        <Dropdown.Divider key={index+'divider'}/>}
                                    </div>
                                );
                            })}
                        </div>
                            : <li key={'random1200'} style={{ marginLeft:'20px', color:'beige' }}>no notifications</li>
                            : ''}
                    </DropdownButton>
                </div>
                : ''}

                {cookie ? <Nav.Link href="/chat"><i className="fas fa-comments" /></Nav.Link>
                : ''}

                <Nav>
                    {cookie ? displayUser() : displayGuest()}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
