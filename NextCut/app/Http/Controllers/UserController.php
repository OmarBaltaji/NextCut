<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Storage;

class UserController extends Controller
{

    public function index() {
        $users = User::all();
        return response()->json($users, 200);
    }

    public function destroy(User $user) {
        if(Auth::user()->id == $user->id) { // If the authenticated user is the current user than allow to delete profile
            $user->destroy($user->id);
            return response()->json(['message' => 'deleted profile'], 200);
        }
    }

    public function update(User $user, Request $request) {
        if(Auth::user()->id == $user->id) { // If the authenticated user is the current user than allow to update profile
           $attributes =  request()->validate([
                'phone_number' => 'required|string|max:20',
            ]);

            $user->update([
                'phone_number' => $attributes['phone_number'],
            ]);

            return response()->json(['message' => 'successful update!'], 200);
        }
    }

    public function updatePhoto(Request $request) {
        if($request->hasFile('profile_photo')) {
            $photo = $request['profile_photo']->store(env('PROFILE_PICTURES_PATH')); // To store photo locally
            $photoInDB = Storage::url($photo); // The url which is stored in the database so it would be retrieved later
        }

        $user = Auth::user();

        $user = User::find($user->id); // Get the authenticated user

        $user->profile_photo = $photoInDB; // Store new photo in database
        $user->save();

        return response()->json(['message' => 'profile photo changed successfully'], 200);
    }
}
