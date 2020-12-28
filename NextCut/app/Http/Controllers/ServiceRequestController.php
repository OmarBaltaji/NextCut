<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class ServiceRequestController extends Controller
{
    public function showBarberRequests() {

        //find the services provided by the barber (who is logged in)
        $user = Auth::user();
        $barber = $user->barber->first();
        $barber_services = $barber->barber_service;

        //get the requests the barber received from customers
        $service_requests = [];
        foreach($barber_services as $barber_service) {
            array_push($service_requests, $barber_service->service_request);
        }

        $booking_details = [];

        foreach($service_requests as $requests) {
            foreach($requests as $request) {
                $customer_request = $request->customer_request;
                if(!in_array($customer_request, $booking_details)) { //get the specific date/time booked
                    $booking_details[] =  $customer_request;
                }
            }
        }

        foreach($booking_details as $detail) {
            $service_requests = $detail->service_request; //get the intermediary table between barber, customer, and customer_request
            foreach($service_requests as $service_request) {
                $service_request->customer->user; //get the customer information
                $service_request->barber_service; //get the services provided by the barber
                $service_request->barber_service->service; //get these services' type
            }
        }

        return response()->json($booking_details, 200);
    }
}
