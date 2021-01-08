<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerRequest;
use App\Models\ServiceRequest;
use Auth;
use Illuminate\Support\Facades\Mail;
use Response;

class CustomerRequestController extends Controller
{
    public function store(Request $request) {

        $user = Auth::user();

        $attribute = $request->validate([
            'date_booked' => 'string',
            'time_booked' => 'string',
            'total_price' => 'integer',
            'total_time' => 'integer',
            'appointment_location' => 'string',

        ]);

        $services_id = $request->validate([
            'barber_service_id' => 'array',
        ]);

        $customer_request =
            CustomerRequest::create([
                'date_booked' => $attribute['date_booked'],
                'time_booked' =>  $attribute['time_booked'],
                'total_price' =>  $attribute['total_price'],
                'total_time' => $attribute['total_time'],
                'appointment_location' =>  $attribute['appointment_location'],
                'completed' => 0,
                'state' => 0,
            ]);

        foreach($services_id['barber_service_id'] as $service_id) {
            ServiceRequest::create([
                'customer_id' => $user->customer->first()->id,
                'barber_service_id' => $service_id,
                'customer_request_id' => $customer_request->id,
            ]);
        }

        return response()->json($customer_request, 200);
    }

    public function updateStatus(Request $request) {
        $customerRequest = CustomerRequest::find($request['customer_request_id']);

        $customerRequest->update([
            'completed' => $request['completed'],
            'state' => $request['state'],
        ]);

        return response()->json($customerRequest, 200);
    }

    public function CheckPreviousBookings() {
        $user = Auth::user();
        $customer = $user->customer->first();
        $servicesRequested =  $customer->service_request;
        foreach($servicesRequested as $serviceRequested) {
            $serviceRequested->customer_request;
        }

        return $customer;
    }

    public function showBookedTimes() {
       $customer_requests = CustomerRequest::all();
       return response()->json($customer_requests, 200);
    }

    public function destroy($id) {
        $customerRequest = CustomerRequest::find($id);
        $customerRequest->destroy($customerRequest->id);

        return response()->json(['message' => 'request is deleted'], 200);
    }

    public function storeToMail() {
        Mail::raw('It Works!', function ($message) {
            $message->from('nextcut@gmail.com', 'NextCut');
            $message->to(request('email'), request('name'));
            $message->subject('Booking Confirmation');
        });

        return response()->json(['message' => 'Mail Sent'], 200);
    }
}
