<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Auth;

class FirebaseController extends Controller
{
    public function save_fcm_token(Request $request) {
        $errors=NULL;
        $message = "Success";

        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required',
        ],
        [
            'title.fcm_token' => 'fcm token required',
        ]);

        if ($validator->fails()) {
            $status = false;
            $errors = $validator->errors();
            $message = " Error !! ";
        }

        $user = Auth::user()->update([
            'fcm_token' => $request->fcm_token,
        ]);

        $status = $user ? true : false;

        return response()->json([
            'message' => $message,
            'status' => $status,
            'errors' => $errors,
            'fcm_token' => $request->fcm_token,
        ]);
    }

    public function sendTo($device_token=null, $title="FCMAPP", $body="FCMAPP BODY", $icon=null, $data) {
        $notification = [
            'title' => $title,
            'body' => $body,
            'icon' => $icon,
        ];

        $notification = array_filter($notification, function($value) {
            return $value !== null;
        });

        $url = 'https://fcm.googleapis.com/fcm/send';
        $fields = array (
            'registration_ids' => $device_token,
            'notification' => $notification,
            'data' => ['fcmapp' => $data]
        );

        $fields = json_encode ( $fields );

        $headers = array (
        'Authorization: key=' . config('fcmapp.server_key'),
        'Content-Type: application/json'
        );

        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, true );
        curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );
        $result = curl_exec ( $ch );
        curl_close ( $ch );

        return $result;
    }
}
