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
        if(Auth::user()->id == $user->id) {
            $user->destroy($user->id);
            return response()->json(['message' => 'deleted profile'], 200);
        }
    }

    public function update(User $user, Request $request) {
        if(Auth::user()->id == $user->id) {
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
            $profile_photo = $request->file('profile_photo');
            $photo = $request['profile_photo']->store(env('PROFILE_PICTURES_PATH'));
            $photoInDB = Storage::url($photo);
        } else {
            $defaultPhoto = env('PROFILE_PICTURES_PATH') . "/none.png";
            $photoInDB = Storage::url($defaultPhoto);
        }

        $user = Auth::user();
        $user = User::find($user->id);

        $user->profile_photo = $photoInDB;
        $user->save();

        return response()->json(['message' => 'profile photo changed successfully'], 200);
    }
}
