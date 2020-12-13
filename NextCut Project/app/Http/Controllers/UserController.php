<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use File;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function destroy(User $user) {
        if(Auth::user()->id == $user->id) {
            $user->destroy($user->id);
            return response()->json(['message' => 'deleted profile'], 200);
        }
    }

    public function update(User $user, Request $request) {
        if(Auth::user()->id == $user->id) {
           $attributes =  request()->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email',
                'profile_photo' => '',
                'phone_number' => 'required|string|max:20',
            ]);

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

            $user->update([
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'profile_photo' => $publicPhotoName,
                'phone_number' => $attributes['phone_number'],
            ]);

            return response()->json(['message' => 'successful update!'], 200);
        }
    }
}
