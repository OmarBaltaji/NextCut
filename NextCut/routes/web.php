<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//So the pages don't 404 when navigating between them

Route::view('{path?}', 'app');

Route::get('/profile/{profile}/edit', function(){
    return view('app');
});

Route::get('/profile/services', function(){
    return view('app');
});

Route::get('/barbers/{barber}', function(){
    return view('app');
});

Route::get('/booking/{barber}', function(){
    return view('app');
});

