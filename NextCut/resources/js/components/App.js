import React from 'react';
import ReactDOM from 'react-dom';
import  {BrowserRouter, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
import About from './About';
import Login from './Login';
import Register from './Register';
import Profile from './Profile/Profile';
import Barbers from './Barbers Section/Barbers';
import ShowBarber from './Barbers Section/ShowBarber';
import Service from './Profile/BarberServices/Service';
import BookBarber from './Booking Section/BookBarber';
import Booking from './Booking Section/Booking';
import ConfirmationPage from './ConfirmationPage';
import Requests from './Requests';
import Statistics from './Statistics';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/aboutus" component={About} />
                <Route exact path="/booking" component={Booking} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/requests" component={Requests} />
                <Route exact path="/confirmedbooking" component={ConfirmationPage} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/statistics" component={Statistics} />
                <Route exact path="/barbers" component={Barbers} />
                <Route exact path="/booking/:id" component={BookBarber} />
                <Route exact path="/barbers/:id" component={ShowBarber} />
                <Route exact path="/profile/services" component={Service} />
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
