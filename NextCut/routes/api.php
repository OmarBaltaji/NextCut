<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\SalonController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Models\Address;
use Illuminate\Http\Request;
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

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/barbers', [BarberController::class, 'index']);

Route::get('/barbers/{barber}', [BarberController::class, 'show']);

Route::get('/barbers/{barber}/services', [BarberController::class, 'services']);

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/userinfo', [AuthController::class, 'userInfo']);

    Route::put('/user/{user}', [UserController::class, 'update']);

    Route::delete('/user/{user}', [UserController::class, 'destroy']);

    Route::get('/user/salon', [SalonController::class, 'show']);

    Route::post('/user/salon', [SalonController::class, 'store']);

    Route::put('/user/salon/{barber}', [SalonController::class, 'update']);

    Route::get('/user/address' , [AddressController::class, 'show']);

    Route::post('/user/address' , [AddressController::class, 'store']);

    Route::put('/user/address/{address}' , [AddressController::class, 'update']);

    Route::get('/user/schedule' , [ScheduleController::class, 'show']);

    Route::post('/user/schedule' , [ScheduleController::class, 'store']);

    Route::put('/user/schedule/{schedule}' , [ScheduleController::class, 'update']);


    Route::get('/user/services' , [ServiceController::class, 'show']);

    Route::post('/user/services' , [ServiceController::class, 'store']);

    Route::put('/user/services/{service}' , [ServiceController::class, 'update']);
});
