import axios from 'axios';
import CookieService from './Service/CookieService';

const BASE_URL = 'http://nextcut.test/api'

// const cookie = CookieService.get('access_token');

// const token = {
//     headers: {
//         'Accept': 'application/json',
//         'Content-type': 'application/json',
//         'Authorization': 'Bearer ' + cookie
//     },
// }

export default{

    login: (credentials) =>
    axios.post(`${BASE_URL}/login`, credentials),

    register: (info, headers) =>
    axios.post(`${BASE_URL}/register`, info, headers),

    getUserInfo: () =>
    axios.get(`${BASE_URL}/userinfo`),

    logout: () =>
    axios.get(`${BASE_URL}/logout`),

    deleteProfile: (user_id) =>
    axios.delete(`${BASE_URL}/user/${user_id}`),

    updateUserInfo: (user_id, info, headers) =>
    axios.put(`${BASE_URL}/user/${user_id}`, info, headers),

    createSalonInfo: (info) =>
    axios.post(`${BASE_URL}/user/salon`, info),

    getAllBarbers: () =>
    axios.get(`${BASE_URL}/barbers`),

    getOneBarber: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}`),

    getBarberServices: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/services`),
}
