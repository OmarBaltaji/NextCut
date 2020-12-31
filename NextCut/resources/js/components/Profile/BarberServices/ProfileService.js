import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import api from '../../../api';
import '../../../../css/Profile.css';

export default function ProfileService() {
    const[barberServices, setBarberServices] = useState([]);

    useEffect(() => {
        getBarberServiceInfo();
    }, []);

    function getBarberServiceInfo() {
        api.getBarberService()
        .then(response => {
            console.log(response.data);
            setBarberServices(response.data);
        });
    }

    return (
        <div className='div_table'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {barberServices.map((barberService, index) => {
                        return (
                            <tr key={barberService.id}>
                                <td>{index}</td>
                                <td>{barberService.service.type}</td>
                                <td>{barberService.price}</td>
                                <td>{barberService.estimated_time}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
);

}
