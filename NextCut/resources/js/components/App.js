import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
import About from './About';
import Login from './Login';
import Register from './Register';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import Schedule from './Schedule';
import Barbers from './Barbers';
import ShowBarber from './ShowBarber';
import Service from './Profile/BarberServices/Service';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/aboutus" component={About} />
                <Route exact path="/schedule" component={Schedule} />
                <Route exact path="/barbers" component={Barbers} />
                <Route exact path="/barbers/:id" component={ShowBarber} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/profile/:id/edit" component={EditProfile} />
                <Route exact path="/profile/services" component={Service} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />

            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
