import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../api';
import { Button, Card, Form, FormControl, InputGroup } from 'react-bootstrap';
import CookieService from '../Service/CookieService';
import '../../css/Head_Log_Reg.css';
import firebaseConfig from '../Firebase/FirebaseConfig';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default function Register() {

    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');;
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('Customer');
    const [errs, setErrs] = useState([]);
    const[invalid, setInvalid] = useState('');

    useEffect(() => {
        redirectHome();

        var user = firebase.auth().currentUser;

        if(errs.length != 0) { //delete a user from firebase in case there are additional errors
            user.delete().then(function() {
                 // User deleted.
            }).catch(function(error) {
                // An error happened.
            });
        }
    }, [errs]);

    function RegistrationHandler(event) {
        event.preventDefault();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((auth) => {
            auth.user.getIdToken().then(function(accessToken) {
                if(auth.additionalUserInfo.isNewUser == true) {
                    const info = new FormData();
                    info.append('Firebasetoken', accessToken);
                    info.append('name', name);
                    info.append('email', email);
                    info.append('password', password);
                    info.append('password_confirmation', confirmedPassword);
                    info.append('profile_photo', profilePhoto);
                    info.append('phone_number', String(phoneNumber));
                    info.append('roles', role);

                    api.register(info, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}
                    }).then(response => {
                        console.log(response.data);
                        const options = {Path: "/",Expires: response.data.expires, Secure: true};
                        CookieService.set('access_token', response.data.access_token, options);
                        history.push("/home");
                        window.location.reload();
                    }).catch(error => {
                        setErrs(error.response.data.errors);
                    });
                }
            })
        }).catch((error) => {
            setInvalid(error.message);
        });
    }

    function displayError (field) {
        if (errs[field]) {
            return (
                <span style={{ display:'block', color: '#980000' }}>
                    {errs[field]}
                </span>
            )
        }
    }

    function redirectHome() {
        let cookie = CookieService.get('access_token');
        if(cookie) {
            history.push('/home');
        }
    }

    function handleProfilePhoto(e) {
        if (e.target.files && e.target.files[0]) {
            // Check this file is an image
            const prefixFiletype = e.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') !== 0) {
                alert('This file is not an image');
                document.getElementById('input_file').value = '';
                return
            }
        } else {
            alert('Something wrong with input file');
        }

        setProfilePhoto(e.target.files[0])
    }

    return (
        <Card style={{margin:'40px auto', width: '300px', padding: '20px', backgroundColor:'#DAA520'}}>
            <Form onSubmit={RegistrationHandler}
            encType="multipart/form-data">
                <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-font icons" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="text"
                        className="input"
                        placeholder="Full Name"
                        onChange={(e) => {setName(e.target.value)}} />
                    </InputGroup>
                    {displayError('name')}
                </Form.Group>
                <Form.Group controlId="formGroupEmail">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-envelope icons" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="email"
                        className="input"
                        placeholder="Email Address"
                        onChange={(e) => {setEmail(e.target.value)}} />
                        {invalid.includes('email') ? <span style={{ color:'#980000' }}>{invalid}</span> : ''}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-lock icons" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="password"
                        className="input"
                        placeholder="Password"
                        onChange={(e) => {setPassword(e.target.value)}} />
                        {invalid.includes('password') ? <span style={{ color:'#980000' }}>{invalid}</span> : ''}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-lock icons" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="password"
                        className="input"
                        placeholder="Confirm Password"
                        onChange={(e) => {setConfirmedPassword(e.target.value)}} />
                        {displayError('password')}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupFile">
                    <Form.File
                    className="position-relative"
                    label="Profile Photo"
                    id="input_file"
                    style= {{ color: '#00356f', fontWeight: 'bold' }}
                    onChange={(e) => {handleProfilePhoto(e)}} />
                </Form.Group>
                <Form.Group controlId="formGroupInput">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-phone-square icons"/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="number"
                        className="input_phone"
                        placeholder="Phone Number"
                        onChange={(e) => {setPhoneNumber(e.target.value)}} />
                        {displayError('phone_number')}
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <Form.Label style={{ margin: '5px 10px 0 0', color:'#00356f', fontWeight: 'bold' }}>
                            Register As
                        </Form.Label>
                        <Form.Control
                        style={{ color: '#00356f' }}
                        onChange={(e) => setRole(e.target.value)}
                        as="select">
                            <option style={{ color: '#00356f' }} key={0} value={'Customer'}>
                                Customer
                            </option>
                            <option style={{ color: '#00356f' }} key={1} value={'Barber '}>
                                Barber
                            </option>
                        </Form.Control>
                    </InputGroup>
                </Form.Group>
                <Button className="btn_log_reg" type="submit">
                    Register
                </Button>
            </Form>
            <Form.Row style={{ padding: '15px 5px', color: '#00356f' }}>
                Already have an account? &nbsp; <Link className='login_register' to="/login">Login</Link>
            </Form.Row>
        </Card>
    );
}
