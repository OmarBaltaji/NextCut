import React, {useState, useEffect} from 'react';
import Header from './Header';
import {useHistory} from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../api';
import {Container} from 'react-bootstrap';

export default function Statistics() {
    const [bookingDetails, setBookingDetails] = useState([]);
    const history = useHistory();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [
        {name: 'Jan', Batata: 400, pv: 2400},
        {name: 'Feb', Batata: 300, pv: 1000},
        {name: 'Mar', Batata: 100, pv: 20},
        {name: 'Apr', Batata: 400, pv: 2400},
        {name: 'May', Batata: 300, pv: 1000},
        {name: 'Jun', Batata: 100, pv: 20},
        {name: 'Jul', Batata: 400, pv: 2400},
        {name: 'Aug', Batata: 300, pv: 1000},
        {name: 'Sep', Batata: 100, pv: 20},
        {name: 'Oct', Batata: 400, pv: 2400},
        {name: 'Nov', Batata: 300, pv: 1000},
        {name: 'Dec', Batata: 100, pv: 20},
    ];

    useEffect(() => {
        getUserDetails();
    }, [])

    function getUserDetails() {
        api.getUserInfo()
        .then(response => {
            if(response.data.roles != 'Barber') {
                history.push('/home');
            }
        }).catch(error => {
            if(error.response.status == 401) {
                history.push('/home')
            }
        })
    }

    function renderLineChart() {
        return (
            <LineChart width={1000} height={500} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="Batata" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#c42121" />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend/>
            </LineChart>
        );
    }

    // [1, 2, 3, 4].reduce((a, b) => a + b, 0)

    // let array = [1, 2, 3, 5, 2, 8, 9, 2]
    // let count = array.filter(x => x === 2).length;
    getMonthCount();

    useEffect(() => {
        getBookingDetails();
    }, []);

    function getBookingDetails() {
        api.getRequestDetails()
        .then(response => {
            setBookingDetails(response.data);
        });
    }

    function getMonthCount() {
        let months_in_requests = [];
        let total_money = [];
        let month_count = [];
        // let unique_months = [];
        if(bookingDetails.length != 0) {
            let i = 0;
            bookingDetails.forEach(detail => {
                let date = detail.date_booked;
                let month = date.split(' ')[1];
                let money = detail.total_price;
                months_in_requests.push(
                    {
                        month: month,
                        money: money,
                    }
                    )
                // let month_obj = {};
                // month_obj[month] = money;
                // months_in_requests.push(month_obj);
            });

            // let money_per_month = [];
            // months_in_requests.forEach(month_obj => {
            //     // money_per_month['Dec'] = 0;
            //     let count = 0;
            //     months.forEach(m => {
            //         if(month_obj.month === m) {
            //             if(count == 0) {
            //                 money_per_month[m] = month_obj.money;
            //                 count += 1;
            //             } else {
            //                 money_per_month[m] += month_obj.money;
            //                 count += 1;
            //             }
            //         }
            //     })
            // })

            // console.log(money_per_month);

            // months_in_requests.forEach(month_object => {
                // if(Object.keys(month_object) == 'Dec') {
                    // month_object.month
                // }
            // })
            // console.log(months_in_requests)
            // let unique_months = [...new Set(months)]
            // console.log(months.filter(x => x === 'Dec').length);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <h1>Statistics</h1>
                {renderLineChart()}
            </Container>
        </>
    );
}
