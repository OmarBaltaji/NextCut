import React, {useState, useEffect} from 'react';
import {Nav, Navbar, NavDropdown, Image} from 'react-bootstrap';
import api from '../api';
import {useHistory} from 'react-router-dom';
import CookieService from '../Service/CookieService';
import '../../css/Home.css';
import logo from '../../../public/Images/logo.png';

export default function Header() {

    const history = useHistory();
    const [userInfo, setUserInfo] = useState([]);
    const cookie = CookieService.get('access_token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');
    let role = localStorage.getItem('role');

    useEffect(() => {
        if(cookie) {
            getUserDetails();
        }
    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
            localStorage.setItem('role', response.data.roles);
            if(response.data.roles == 'Customer') {
                api.setCustomer()
                .then(response => {
                }).catch(error => {

                });
            }
        })
    }

    function logoutHandler(e) {
        e.preventDefault();
        api.logout().then(response => {
            CookieService.remove('access_token');
            window.localStorage.clear();
            history.push('/login');
            window.location.reload;
        })
    }

    function displayUser() {
        return (

                <NavDropdown style={{ marginRight: '20px' }} className="user-dropdown"  title={userInfo.name} id="collasible-nav-dropdown">
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
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
            </>
        );
    }

    return (
       <>
        <Navbar collapseOnSelect expand='lg' sticky="top" style={{ backgroundColor: '#DAA520' }}>
            <Navbar.Brand className="navlink"  href="/home">
                <Image src={logo} height="60px" width="70px"
                alt="logo" />
             </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className="navlink" href="/home">Home</Nav.Link>
                    <Nav.Link className="navlink" href="/aboutus">About Us</Nav.Link>
                    <Nav.Link className="navlink" href="/barbers">Barbers</Nav.Link>
                    {userInfo.roles != 'Barber' || role != 'Barber' ?
                    <Nav.Link className="navlink" href="/booking">Book!</Nav.Link>
                    : ''}
                    {userInfo.roles == 'Barber' || role == 'Barber'?
                    <Nav.Link className="navlik" href="/requests" >Requests</Nav.Link>
                    : ''}
                    {/* {userInfo.roles == 'Barber' || role == 'Barber'?
                    <Nav.Link className="navlik" href="/statistics" >Statistics</Nav.Link>
                    : ''} */}
                </Nav>
                <Nav>
                    {cookie ? displayUser() : displayGuest()}
                </Nav>
                </Navbar.Collapse>
        </Navbar>

        <br/>
        </>
    );
}
