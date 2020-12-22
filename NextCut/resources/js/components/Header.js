import React, {useState, useEffect} from 'react';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';
import api from '../api';
import {useHistory} from 'react-router-dom';
import CookieService from '../Service/CookieService';
import '../../css/Home.css';

export default function Header() {

    const history = useHistory();
    const [userInfo, setUserInfo] = useState([]);
    const cookie = CookieService.get('access_token');

    useEffect(() => {
        if(cookie) {
            getUserDetails();
        }

    }, []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {

            setUserInfo(response.data);
            localStorage.setItem('role', response.data.roles)
        })
    }

    function logoutHandler(e) {
        e.preventDefault();
        api.logout().then(response => {
            window.localStorage.clear();
            CookieService.remove('access_token');
            history.push('/login');
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
        <Navbar  expand='sm' sticky="top" style={{ backgroundColor: '#DAA520' }}>
            <Navbar.Brand className="navlink"  href="/home">NextCut</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link className="navlink" href="/home">Home</Nav.Link>
                    <Nav.Link className="navlink" href="/aboutus">About Us</Nav.Link>
                    <Nav.Link className="navlink" href="/barbers">Barbers</Nav.Link>
                    {localStorage.getItem('role') != 'Barber' ?
                    <Nav.Link className="navlink" href="/booking">Book!</Nav.Link> : '' }
                </Nav>
                <Nav>
                    {cookie ? displayUser() : displayGuest()}
                </Nav>
        </Navbar>
        <br/>
        </>
    );
}
