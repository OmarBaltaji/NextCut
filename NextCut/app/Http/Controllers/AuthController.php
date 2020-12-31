<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
// use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Firebase\Auth\Token\Exception\InvalidToken;

class AuthController extends Controller
{
    public function firebaseLogin(Request $request) {
        // Launch Firebase Auth
        $auth = app('firebase.auth');
        // Retrieve the Firebase credential's token
        $idTokenString = $request->input('Firebasetoken');


        try { // Try to verify the Firebase credential token with Google

            $verifiedIdToken = $auth->verifyIdToken($idTokenString);

        } catch (\InvalidArgumentException $e) { // If the token has the wrong format

            return response()->json([
                'message' => 'Unauthorized - Can\'t parse the token: ' . $e->getMessage()
            ], 401);

        } catch (InvalidToken $e) { // If the token is invalid (expired ...)

            return response()->json([
                'message' => 'Unauthorized - Token is invalide: ' . $e->getMessage()
            ], 401);

        }

        // Retrieve the UID (User ID) from the verified Firebase credential's token
        $uid = $verifiedIdToken->getClaim('sub');

        // Retrieve the user model linked with the Firebase UID
        $user = User::where('firebaseUID',$uid)->first();
        $tokenResult = $user->createToken('Personal Access Token');

        // Store the created token
        $token = $tokenResult->token;

        // Add a expiration date to the token
        $token->expires_at = Carbon::now()->addWeeks(1);

        // Save the token to the user
        $token->save();

        // Return a JSON object containing the token datas
        // You may format this object to suit your needs
        return response()->json([
            'id' => $user->id,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
            $tokenResult->token->expires_at
            )->toDateTimeString()
        ]);

    }

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
            return response()->json(['message' => 'invalid email/password combination'], 401);
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
            'name' => 'required|string|max:200',
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
            'profile_photo' => '',
            'phone_number' => 'required|string|max:20',
            'roles' => 'required',
        ]);

        //Image
        if($request->hasFile('profile_photo')) {
            $profile_photo = $request->file('profile_photo');
            $photo = $request['profile_photo']->store(env('PROFILE_PICTURES_PATH'));
            $photoInDB = Storage::url($photo);
        } else {
            $defaultPhoto = env('PROFILE_PICTURES_PATH') . "/none.png";
            $photoInDB = Storage::url($defaultPhoto);
        }

        //create a new user
        $user = User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => bcrypt($attributes['password']),
            'profile_photo' => $photoInDB,
            'phone_number' => $attributes['phone_number'],
            'roles' => $attributes['roles'],
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
