import React from 'react';
import Header from './Header';
import CookieService from '../Service/CookieService';

export default function Home() {

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + CookieService.get('access_token');

    return (
        <div>
            <Header/>
            <h1>Home</h1>
        </div>
    );
}
