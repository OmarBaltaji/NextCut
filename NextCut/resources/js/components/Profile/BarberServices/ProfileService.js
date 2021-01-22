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
            setBarberServices(response.data);
        });
    }

    return (
        <div className='div_table'>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th className="profile_spans">#</th>
                        <th className="profile_spans">Type</th>
                        <th className="profile_spans">Price</th>
                        <th className="profile_spans">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {barberServices.map((barberService, index) => {
                        return (
                            <tr key={barberService.id}>
                                <td className="profile_spans">{index}</td>
                                <td className="profile_spans">{barberService.service.type}</td>
                                <td className="profile_spans">{barberService.price}</td>
                                <td className="profile_spans">{barberService.estimated_time}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
}
