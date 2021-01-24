import axios from 'axios';

const BASE_URL = '/api';

export default{

    firebaseLogin: (credentials) =>
    axios.post(`${BASE_URL}/signin`, credentials),

    register: (info, headers) =>
    axios.post(`${BASE_URL}/register`, info, headers),

    getUserInfo: () =>
    axios.get(`${BASE_URL}/userinfo`),

    logout: () =>
    axios.get(`${BASE_URL}/logout`),

    deleteProfile: (user_id) =>
    axios.delete(`${BASE_URL}/user/${user_id}`),

    updateProfilePhoto: (photo, headers) =>
    axios.post(`${BASE_URL}/user/photo`, photo, headers),

    updateUserInfo: (user_id, info, headers) =>
    axios.put(`${BASE_URL}/user/${user_id}`, info, headers),

    getCustomerAddress: () =>
    axios.get(`${BASE_URL}/user/customeraddress`),

    createCustomerAddress: (info) =>
    axios.post(`${BASE_URL}/user/customeraddress`, info),

    editCustomerAddress: (info, id) =>
    axios.put(`${BASE_URL}/user/customeraddress/${id}`, info),

    // The following api calls are meant for barbers' profiles only
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

    getService: () => // This means Service's type
    axios.get(`${BASE_URL}/user/services`),

    createService: (type) =>
    axios.post(`${BASE_URL}/user/services`, type),

    getBarberService: () => // Barber's service as in the service type, price, and duration
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

    // End of api calls for barbers' profiles

    getAllBarbers: () =>
    axios.get(`${BASE_URL}/barbers`),

    getOneBarber: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}`),

    // Get details of a chosen barber after browsing through barbers as a customer
    getBarberServices: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/services`),

    getBarberSchedule: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/schedule`),

    getBarberGallery: (id) =>
    axios.get(`${BASE_URL}/barbers/${id}/gallery`),

    // End of obtaining the details for the chosen barber

    storeCustomerRequest: (info) =>
    axios.post(`${BASE_URL}/booking/confirmation`,info),

    sendMailConfirmation: (info) =>
    axios.post(`${BASE_URL}/booking/confirmationtomail`,info),

    setCustomer: () =>
    axios.post(`${BASE_URL}/customer`),

    getRequestDetails: () =>
    axios.get(`${BASE_URL}/requests`),

    alterStatus: (info) =>
    axios.post(`${BASE_URL}/alterstatus`, info),

    deleteRequest: (id) =>
    axios.delete(`${BASE_URL}/request/${id}`),

    getPreviousBookings: () =>
    axios.get(`${BASE_URL}/previousbookings`),

    getBookedTimes: () =>
    axios.get(`${BASE_URL}/bookedtimes`),

    getUsers: () =>
    axios.get(`${BASE_URL}/users`),
}
