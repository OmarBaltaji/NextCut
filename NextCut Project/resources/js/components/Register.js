import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../api';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import CookieService from '../Service/CookieService';

export default function Register() {

    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');;
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errs, setErrs] = useState([]);

    function RegistrationHandler(event) {
        event.preventDefault();

        const info = new FormData();
        info.append('name', name);
        info.append('email', email);
        info.append('password', password);
        info.append('password_confirmation', confirmedPassword);
        info.append('profile_photo', profilePhoto);
        info.append('phone_number', phoneNumber);

        api.register(info, {headers:{'Accept': "application/json", 'Content-Type':"multipart/form-data"}
        }).then(response => {
            console.log(response.data);
            const options = {Path: "/",Expires: response.data.expires, Secure: true};
            CookieService.set('access_token', response.data.access_token, options);
            history.push("/home");
        }).catch(error => {
            if(name == '' | email == '' | password == '' | confirmedPassword == '' | phoneNumber == '') {
                setErrs(error.response.data.errors);
            }
        });
    }

    function displayError (field) {
        if (errs[field]) {
            return (
                <span style={{ color: 'red' }}>
                    <strong>{errs[field]}</strong>
                </span>
            )
        }
    }

    return (
        <Card style={{margin:'65px auto', width: '300px', padding: '20px', backgroundColor:'#B7410E'}}>
            <Form onSubmit={RegistrationHandler}
            encType="multipart/form-data">
                <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-font" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="text"
                        className="input"
                        placeholder="Full Name"
                        onChange={(e) => {setName(e.target.value)}} />
                        {displayError('name')}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupEmail">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-envelope" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="email"
                        className="input"
                        placeholder="Email Address"
                        onChange={(e) => {setEmail(e.target.value)}} />
                        {displayError('email')}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-lock" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="password"
                        className="input"
                        placeholder="Password"
                        onChange={(e) => {setPassword(e.target.value)}} />
                        {displayError('password')}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-lock" />
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
                    label="Profile Photo"
                    style= {{ color: '#40E0D0' }}
                    onChange={(e) => {setProfilePhoto(e.target.files[0])}} />
                </Form.Group>
                <Form.Group controlId="formGroupInput">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-phone-square"/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="tel"
                        className="input"
                        placeholder="Phone Number"
                        onChange={(e) => {setPhoneNumber(e.target.value)}}  />
                        {displayError('phone_number')}
                    </InputGroup>
                </Form.Group>
                <Button className="btn_log_reg" type="submit">
                    Register
                </Button>
            </Form>
            <Form.Row style={{ padding: '15px 5px', color: '#40E0D0' }}>
                Already have an account? &nbsp; <Link className='login_register' to="/login">Login</Link>
            </Form.Row>
        </Card>
    );
}
