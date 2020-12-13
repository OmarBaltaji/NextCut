<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\File;

class AuthController extends Controller
{
    public function login(Request $request) {
        $attributes = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);

        $credentials = [
            'email' => $attributes['email'],
            'password' => $attributes['password'],
        ];

        //if user not logged in
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'unauthorized'], 401);
        }

        $user = auth()->user();

        $result_token = $user->createToken('Personal Access Token');
        $token = $result_token->token;

        if($attributes['remember_me']) {
            $token->expires_at = Carbon::now()->addWeeks(1);
        } else {
            $token->expires_at = Carbon::now()->addDay();
        }
        $token->save();

        return response()->json([
        'access_token' => $result_token->accessToken,
        'token_type' => 'Bearer',
        'expires_at' => Carbon::parse($token->expires_at)->toDateTimeString()], 200);//To human readable form
    }

    public function register(Request $request) {
        $attributes = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
            'profile_photo' => '',
            'phone_number' => 'required|string|max:20',
        ]);

        //Image
        if($request->hasFile('profile_photo')) {
            $profile_photo = $request->file('profile_photo');
            $PhotoNameWithExtension = $profile_photo->getClientOriginalName();
            $PhotoNameOnly = pathinfo($PhotoNameWithExtension, PATHINFO_FILENAME);
            $photoExtension = $profile_photo->getClientOriginalExtension();
            $publicPhotoName = $PhotoNameOnly . '_' . time() . '.' . $photoExtension;

            if(!File::exists(public_path()."/Images/userImage")){
                File::makeDirectory(public_path()."/Images/userImage");
            }

            $profile_photo->move(public_path().'/Images/userImage/', $publicPhotoName );

        } else {
            $publicPhotoName = "none.png";
        }

        //create a new user
        $user = User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => bcrypt($attributes['password']),
            'profile_photo' => $publicPhotoName,
            'phone_number' => $attributes['phone_number'],
        ]);

        $result_token = $user->createToken('Personal Access Token'); //to login immediately after registering
        $token = $result_token->token;

        $token->expires_at = Carbon::now()->addDay();
        $token->save();

        return response()->json([
            'access_token' => $result_token->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($token->expires_at)->toDateTimeString()],200);
    }

    public function logout() {
        $user = auth()->user();
        $user->token()->revoke(); //destroy token
        return response()->json(['message' => 'logged out'], 200);
    }

    public function userInfo() {
        $user = auth()->user(); //instance of user
        return response()->json($user, 200);
    }
}
