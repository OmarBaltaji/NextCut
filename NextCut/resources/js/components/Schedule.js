import React from 'react';
import Header from './Header';
import CookieService from '../Service/CookieService';

export default function Schedule() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');

    return (
        <div>
            <Header/>
            <h1>Schedule</h1>
        </div>
    );
}
