import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import CookieService from '../Service/CookieService';
import api from '../api';
import {Card, Form, Button, InputGroup} from 'react-bootstrap';
import '../../css/Head_Log_Reg.css';
import firebaseConfig from '../Firebase/FirebaseConfig';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [invalid, setInvalid] = useState('');

    useEffect(() => {
        redirectHome();
    }, [])

    function logInHandler(event) {
        event.preventDefault();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((auth) => {
            auth.user.getIdToken().then(function(accessToken) {
                if(auth.additionalUserInfo.isNewUser == false) {
                    const credentials = {
                        'Firebasetoken': accessToken,
                        'email': email,
                        'password': password,
                        'remember_me': rememberMe,
                    }

                    api.firebaseLogin(credentials)
                    .then(response => {
                        const options = {Path: '/' , Expires: response.data.expires_at, Secure: true};
                        CookieService.set('access_token', response.data.access_token, options);
                        history.push('/home');
                        window.location.reload();
                    })
                }
            })
        }).catch(error => {
            setInvalid(error.message)
        });
    }

    function redirectHome() {
        let cookie = CookieService.get('access_token');
        if(cookie) {
            history.push('/home');
        }
    }

    return (
        <Card style={{margin:'150px auto', width: '320px', padding: '20px', backgroundColor:'#DAA520'}}>
            <Form onSubmit={logInHandler}>
                <Form.Group controlId="formBasicEmail" style={{ paddingTop: '20px' }}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-envelope icons"/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="email"
                        className = "input"
                        placeholder="Enter Email"
                        onChange={(e) => {setEmail(e.target.value)}}
                        style={{ color: '#00356f' }} />
                    </InputGroup>
                    {invalid.includes('email') ? <span style={{ color:'#980000' }}>{invalid}</span> : ''}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <i className="fas fa-lock icons" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        type="password"
                        className="input"
                        placeholder="Enter Password"
                        onChange={(e) => {setPassword(e.target.value)}} />
                    </InputGroup>
                    {invalid.includes('password') ? <span style={{ color:'#980000' }}>{invalid}</span> : ''}
                </Form.Group>
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
            <Form.Row style={{ padding: '15px 5px', color: '#00356f' }}>
                Don't have an account? &nbsp;<Link className='login_register' to="/register">Register</Link>
            </Form.Row>
        </Card>
    );
}
