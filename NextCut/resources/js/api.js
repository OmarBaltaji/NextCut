import axios from 'axios';
import CookieService from './Service/CookieService';

const BASE_URL = 'http://nextcut.test/api'

export default{

    firebaseLogin: (fbtoken) =>
    axios.post(`${BASE_URL}/signin`, fbtoken),

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

    getSalonInfo: () =>
    axios.get(`${BASE_URL}/user/salon`),

    createSalonInfo: (info) =>
    axios.post(`${BASE_URL}/user/salon`, info),

    editSalonInfo: (info, id) =>
    axios.put(`${BASE_URL}/user/salon/${id}`, info),

    getAddress: () =>
    axios.get(`${BASE_URL}/user/address`),

    createAddress: (info) =>
    axios.post(`${BASE_URL}/user/address`, info),

    editAddress: (info, id) =>
    axios.put(`${BASE_URL}/user/address/${id}`, info),

    getSchedule: () =>
    axios.get(`${BASE_URL}/user/schedule`),

    createSchedule: (info) =>
    axios.post(`${BASE_URL}/user/schedule`, info),

    editSchedule: (info, id) =>
    axios.put(`${BASE_URL}/user/schedule/${id}`, info),

    getService: () =>
    axios.get(`${BASE_URL}/user/services`),

    createService: (type) =>
    axios.post(`${BASE_URL}/user/services`, type),

    editService: (type, id) =>
    axios.put(`${BASE_URL}/user/services/${id}`, type),

    deleteService: (id) =>
    axios.delete(`${BASE_URL}/user/services/${id}`),

    //the user is a barber we are getting his/her particular services
    getBarberService: () =>
    axios.get(`${BASE_URL}/user/barberservices`),

    createBarberService: (info) =>
    axios.post(`${BASE_URL}/user/barberservices`, info),

    editBarberService: (info, id) =>
    axios.put(`${BASE_URL}/user/barberservices/${id}`, info),

    deleteBarberService: (id) =>
    axios.delete(`${BASE_URL}/user/barberservices/${id}`),

    getGalleries: () =>
    axios.get(`${BASE_URL}/user/galleries`),

    createGallery: (info, headers) =>
    axios.post(`${BASE_URL}/user/galleries`, info, headers),

    deleteGallery: (id) =>
    axios.delete(`${BASE_URL}/user/galleries/${id}`),

    getAllBarbers: () =>
    axios.get(`${BASE_URL}/barbers`),

    getOneBarber: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}`),

    //get a particular barber's services after browsing through barbers as a customer
    getBarberServices: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/services`),

    getBarberSchedule: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/schedule`),

    getBarberGallery: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/gallery`),

    getOneBarberServiceDetails: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/barberservice`),

    getSearchedBarber: (name) =>
    axios.post(`${BASE_URL}/booking/searchedbarber`, name),

    storeCustomerRequest: (info) =>
    axios.post(`${BASE_URL}/booking/confirmation`,info),

    setCustomer: () =>
    axios.post(`${BASE_URL}/customer`),

    getRequestDetails: () =>
    axios.get(`${BASE_URL}/requests`),

    alterStatus: (info) =>
    axios.post(`${BASE_URL}/alterstatus`, info),

    getPreviousBookings: () =>
    axios.get(`${BASE_URL}/previousbookings`),

    getBookedTimes: () =>
    axios.get(`${BASE_URL}/bookedtimes`),
}
