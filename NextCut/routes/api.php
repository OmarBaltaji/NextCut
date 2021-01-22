<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\CustomerRequestController;
use App\Http\Controllers\SalonController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/signin', [AuthController::class, 'firebaseLogin']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/barbers', [BarberController::class, 'index']);

Route::get('/barbers/{barber}', [BarberController::class, 'show']);

Route::get('/barbers/{barber}/services', [BarberController::class, 'services']);

Route::get('/barbers/{barber}/schedule', [BarberController::class, 'barberSchedule']);

Route::get('/barbers/{barber}/gallery', [BarberController::class, 'barberGallery']);

Route::get('/bookedtimes', [CustomerRequestController::class, 'showBookedTimes']);

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/userinfo', [AuthController::class, 'userInfo']);

    Route::get('/users', [UserController::class, 'index']);

    Route::post('/user/photo', [UserController::class, 'updatePhoto']);

    Route::get('/user/customeraddress' , [AddressController::class, 'showCustomerAddress']);

    Route::post('/user/customeraddress' , [AddressController::class, 'storeCustomerAddress']);

    Route::put('/user/customeraddress/{address}' , [AddressController::class, 'updateCustomerAddress']);

    Route::put('/user/{user}', [UserController::class, 'update']);

    Route::delete('/user/{user}', [UserController::class, 'destroy']);

    Route::post('/customer', [CustomerController::class, 'store']);

    Route::post('/booking/confirmation', [CustomerRequestController::class, 'store']);

    Route::post('/booking/confirmationtomail', [CustomerRequestController::class, 'storeToMail']);

    Route::get('/previousbookings', [CustomerRequestController::class, 'CheckPreviousBookings']);

    Route::group(['middleware' => 'check_role_barber:api'],function() {

        Route::get('/user/salon', [SalonController::class, 'show']);

        Route::post('/user/salon', [SalonController::class, 'store']);

        Route::put('/user/salon/{barber}', [SalonController::class, 'update']);

        Route::get('/user/address' , [AddressController::class, 'show']);

        Route::post('/user/address' , [AddressController::class, 'store']);

        Route::put('/user/address/{address}' , [AddressController::class, 'update']);

        Route::get('/user/schedule' , [ScheduleController::class, 'show']);

        Route::post('/user/schedule' , [ScheduleController::class, 'store']);

        Route::put('/user/schedule/{schedule}' , [ScheduleController::class, 'update']);

        Route::get('/user/services' , [ServiceController::class, 'showAllServices']);

        Route::get('/user/barberservices' , [ServiceController::class, 'showBarberService']);

        Route::post('/user/services' , [ServiceController::class, 'storeService']);

        Route::post('/user/barberservices' , [ServiceController::class, 'storeBarberService']);

        Route::put('/user/barberservices/{barberService}' , [ServiceController::class, 'updateBarberService']);

        Route::delete('/user/barberservices/{barberService}', [ServiceController::class, 'deleteBarberService']);

        Route::get('/user/galleries' , [GalleryController::class, 'index']);

        Route::post('/user/galleries' , [GalleryController::class, 'store']);

        Route::delete('/user/galleries/{gallery}' , [GalleryController::class, 'destroy']);

        Route::get('/requests' , [ServiceRequestController::class, 'showBarberRequests']);

        Route::post('/alterstatus', [CustomerRequestController::class, 'updateStatus']);

        Route::delete('/request/{CustomerRequest}', [CustomerRequestController::class, 'destroy']);
    });

});
