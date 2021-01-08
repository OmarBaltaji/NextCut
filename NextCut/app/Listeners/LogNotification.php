<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Events\NotificationSent;
use App\Http\Controllers\FirebaseController;
use Illuminate\Queue\InteractsWithQueue;
use Auth;

class LogNotification implements ShouldQueue
{
    use  InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(NotificationSent $event)
    {
        $user_not = $event->notifiable;
        if($user_not->fcm_token){
             $data_notify= $event->response;
            $data=json_encode([
                'id' => $data_notify->id,
                'message' => $data_notify->data['message'],
                'created_at' => $data_notify->created_at->diffForHumans(),
                'read_at' => $data_notify->read_at,
            ]) ;
            $body= $data_notify->data['message'];
            $title = config('app.NEXTCUT');
            $icon = null;
            $auth_id = Auth::id();
            $device_token= [$user_not->fcm_token];
            $ob = new FirebaseController;
            $result = $ob->sendTo($device_token, $title, $body, $icon, $data);
        }
    }
}
