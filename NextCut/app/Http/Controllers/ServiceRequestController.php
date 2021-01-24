<?php

namespace App\Http\Controllers;

use Auth;

class ServiceRequestController extends Controller
{
    public function showBarberRequests() {

        $user = Auth::user();
        $barber = $user->barber->first();
        $barber_services = $barber->barber_service;  // Find All the services provided by the barber (who is logged in)

        $service_requests = [];

        foreach($barber_services as $barber_service) {
            $service_requests[] = $barber_service->service_request; // Extract eh service request details through the services provided by the authenticated barber
        }

        //service_requests is a 2D array consisting of the service request details consisting of customer_id, barber_service_id, customer_request_id
        // all ids will be used later to extract objects that would help display the booking details

        $booking_details = [];

        foreach($service_requests as $requests) {
            foreach($requests as $request) {
                $customer_request = $request->customer_request; /// Details about the booking the customer made (booking time, booking date...)
                if(!in_array($customer_request, $booking_details)) { // Get unique customer requests (to ensure there is no duplicates in date and time combinations)
                    $booking_details[] =  $customer_request; // Add to the array
                }
            }
        }

        foreach($booking_details as $detail) {
            $service_requests = $detail->service_request; // Get the intermediary table between barber_service, customer, and customer_request (it's an object that contains the id of these 3)
            foreach($service_requests as $service_request) {
                $service_request->customer->user; // Get the customer information
                $service_request->barber_service; // Get the services provided by the barber that a particular customer requested
                $service_request->barber_service->service; // Get these services' type
            }
        }

        // $booking_details contains details about the services customers requested  as well as details about the bookings each customer made

        return response()->json($booking_details, 200);
    }
}
