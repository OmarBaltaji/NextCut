import React, { useEffect, useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import axios from 'axios';
import {Button, Form, InputGroup, Col, Card} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';

export default function EditProfile() {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');

    const param = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePhoto, setProfilePhoto] = useState();
    const [errs, setErrs] = useState([]);
    const history = useHistory();

    useEffect(() => getUserDetails(), []);

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
            setName(response.data.name);
            setPhoneNumber(response.data.phone_number);
            setEmail(response.data.email);
        })
    }

    function editHandler(event) {
      event.preventDefault();

      const newInfo = new FormData();
      newInfo.append('name', name);
      newInfo.append('email', email);
      newInfo.append('phone_number', phoneNumber);
      newInfo.append('profile_photo', profilePhoto);

    // const newInfo = {
    //     'name': name,
    //     'email': email,
    //     'phone_number': phoneNumber,
    //     'profile_photo': profilePhoto,
    // };

      api.updateUserInfo(
        param.id, newInfo, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}
        //
        }).then(response => {
            console.log(response.data);
            // history.push('/profile');
        }).catch(error => {
            console.log(error);
        });
    }

    function displayError (field) {
        if (errs[field]) {
            return (
                <span style={{ color: 'red' }}>
                    <strong>{errs[field]}</strong>
                </span>
            );
        }
    }

    return (
        <>
           <Header />
           <Card style={{margin:'65px auto', width: '300px', padding: '20px'}}>
                <Form onSubmit={editHandler}
                 encType="multipart/form-data">
                {/* <input type='hidden' name='_method' value='Put' /> */}
                    <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => {setName(e.target.value)}} />
                        {displayError('name')}
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => {setEmail(e.target.value)}} />
                        {displayError('email')}
                    </Form.Group>
                    <Form.Group controlId="formGroupFile">
                        <Form.File
                        label="Profile Photo"
                        onChange={(e) => {setProfilePhoto(e.target.files[0])}} />
                    </Form.Group>
                    <Form.Group controlId="formGroupInput">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                        type="tel"
                        value={userInfo.phone_number}
                        onChange={(e) => {setPhoneNumber(e.target.value)}} />
                        {displayError('phone_number')}
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Card>
        </>
    );
}
