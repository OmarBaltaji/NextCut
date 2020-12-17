import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import CookieService from '../Service/CookieService';
import api from '../api';
import {Card, Form, Button, InputGroup} from 'react-bootstrap';

export default function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errs, setErrs] = useState([]);
    const [invalid, setInvalid] = useState('');

    function logInHandler(event) {
        event.preventDefault();
        const credentials = {
            'email': email,
            'password': password,
            'remember_me': rememberMe,
        };

        api.login(credentials)
        .then((response) => {
            const options = {Path: "/" , Expires: response.data.expires_at, Secure: true};
            CookieService.set('access_token', response.data.access_token, options);
            history.push("/home");
        }).catch(error => {
            if(error.response.status == 422) {
                setErrs(error.response.data.errors);
            } else if(error.response.status == 401) {
                setInvalid(error.response.data.message);
            }
        });
    }

    function displayError (field) {
        if (errs[field]) { //checks if field(username or password) exists within errs array
            return (
                <span style={{ color: 'red', fontWeight: "bold" }}>
                    {errs[field]} {/*displays the value in errs assosiative array*/}
                </span>
            )
        }
    }

    return (
        <Card style={{margin:'150px auto', width: '320px', padding: '20px', backgroundColor:'#B7410E'}}>
            <Form onSubmit={logInHandler}>
                <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-envelope" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="email"
                        className = "input"
                        placeholder="Enter Email"
                        onChange={(e) => {setEmail(e.target.value)}}
                        style={{ color: '#40E0D0' }} />
                        {displayError('email')}
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                            <i className="fas fa-lock" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="password"
                        className="input"
                        placeholder="Enter Password"
                        onChange={(e) => {setPassword(e.target.value)}} />
                        {displayError('password')}
                    </InputGroup>
                </Form.Group>
                <span style={{ color:'red', fontWeight:'bold' }}>{invalid}</span>
                <Form.Group controlId="formBasicCheckbox" >
                <div className="remember_me">
                    <Form.Check
                    type="checkbox"
                    label="Remember Me"
                    onChange={(e) => setRememberMe(!rememberMe)}
                    />
                    </div>
                </Form.Group>
                <Button className="btn_log_reg" type="submit">
                    Login
                </Button>
            </Form>
            <Form.Row style={{ padding: '15px 0', color: '#40E0D0' }}>
                Don't have an account? &nbsp;<Link className='login_register' to="/register">Register</Link>
            </Form.Row>
        </Card>
    );
}
