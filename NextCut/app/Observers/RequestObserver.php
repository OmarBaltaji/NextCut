<?php

namespace App\Observers;

use App\Models\CustomerRequest;
use App\Models\User;

use App\Http\Controllers\FirebaseController;
use Illuminate\Support\Facades\DB;
use Auth;

use Illuminate\Support\Facades\Notification;
use App\Notifications\PushNotification;

class RequestObserver
{
    /**
     * Handle the CustomerRequest "created" event.
     *
     * @param  \App\Models\CustomerRequest  $customerRequest
     * @return void
     */
    public function created(CustomerRequest $customerRequest)
    {
        // $title = "New Booking";
        // $body = "Date : ".$customerRequest->date_booked;
        // $icon = null;
        // $data = $customerRequest;
        // $auth_id = Auth::id();
        // $device_token = DB::table('users')->where('id','<>',$auth_id)->where('fcm_token','!=','')->pluck('fcm_token')->toArray();
        // $ob = new FirebaseController;
        // $result = $ob->sendTo($device_token, $title, $body, $icon, $data);

        $auth_id = Auth::id();
        $users = User::where('id','!=',$auth_id)->get();
        Notification::send($users ,new PushNotification($customerRequest));
    }

    /**
     * Handle the CustomerRequest "updated" event.
     *
     * @param  \App\Models\CustomerRequest  $customerRequest
     * @return void
     */
    public function updated(CustomerRequest $customerRequest)
    {
        //
    }

    /**
     * Handle the CustomerRequest "deleted" event.
     *
     * @param  \App\Models\CustomerRequest  $customerRequest
     * @return void
     */
    public function deleted(CustomerRequest $customerRequest)
    {
        //
    }

    /**
     * Handle the CustomerRequest "restored" event.
     *
     * @param  \App\Models\CustomerRequest  $customerRequest
     * @return void
     */
    public function restored(CustomerRequest $customerRequest)
    {
        //
    }

    /**
     * Handle the CustomerRequest "force deleted" event.
     *
     * @param  \App\Models\CustomerRequest  $customerRequest
     * @return void
     */
    public function forceDeleted(CustomerRequest $customerRequest)
    {
        //
    }
}
