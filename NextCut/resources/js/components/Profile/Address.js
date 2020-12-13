import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../Header';
import api from '../../api';
import axios from 'axios';
import {Button, Form, InputGroup, Col, Card} from 'react-bootstrap';
import CookieService from '../../Service/CookieService';

export default function EditProfile(props) {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');

    return (
        <>
            <h3>Address Details</h3>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} md="3" controlId="validationCustom03">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label>Street</Form.Label>
                        <Form.Control type="text" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid street.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label>Building</Form.Label>
                        <Form.Control type="text" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid building.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                        <Form.Label>Near</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Submit form</Button>
            </Form>
        </>
);

}
