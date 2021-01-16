<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerRequest;
use App\Models\ServiceRequest;
use Auth;
use File;
use Illuminate\Support\Facades\Mail;
use Response;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Storage;

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
            'customer_address' => '',
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
                'customer_address' => $attribute['customer_address'],
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

    // public function storeToMail() {
    //     Mail::raw('It Works!', function ($message) {
    //         $message->from('nextcut@gmail.com', 'NextCut');
    //         $message->to(request('email'), request('name'));
    //         $message->subject('Booking Confirmation');
    //     });

    //     return response()->json(['message' => 'Mail Sent'], 200);
    // }

    public function storeToMail() {
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->Mailer = "smtp";
        $mail->SMTPDebug  = 1;
        $mail->SMTPAuth   = TRUE;
        $mail->SMTPSecure = "tls";
        $mail->Port = 587;
        $mail->Host = "smtp.gmail.com";
        $mail->Username = "nextcutb@gmail.com";
        $mail->Password = "next_21_cut";
        $mail->IsHTML(true);
        $mail->AddAddress(request('email'), request('name'));
        $mail->SetFrom("nextcutb@gmail.com", "NextCut");
        $mail->AddReplyTo("nextcutb@gmail.com", "NextCut");
        $mail->Subject = "Booking Confirmation";

        $content =
        "<h4 style='color:#00356f'>Hello " . request('name') . ",</h4>
        <span style='color:#00356f'>Your booking with " . request('barber_name') . " is confirmed. Please find the booking details below: </span><hr/>" .
        "<span style='color:#00356f'>Barber: " .request('barber_name') . "</span><br/>" .
        "<span style='color:#00356f'>Payment Method: Cash </span><br/>
        <span style='color:#00356f'>Appointment Date: " . request('app_date')  . "</span><br/>" .
        "<span style='color:#00356f'>Appointment Time: " .request('app_time') . "</span><br/>" .
        "<span style='color:#00356f'>Appointment Location: " .request('app_location') . "</span><br/>" .
        "<span style='color:#00356f'>Chosen Services: " .request('services') . "</span><br/>" .
        "<span style='color:#00356f'>Total: " .request('total') . "</span><br/><br/>
        <span style='color:#00356f'>Kind Regards,</span><br/>
        <span style='color:#00356f'>Nextcut</span><br/>";

        $mail->MsgHTML($content);
        if(!$mail->Send()) {
            echo "Error while sending Email.";
            var_dump($mail);
        } else {
            echo "Email sent successfully";
        }
    }
}
