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
                'phone_number' => 'required|string|max:20',
            ]);

            $user->update([
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'phone_number' => $attributes['phone_number'],
            ]);

            return response()->json(['message' => 'successful update!'], 200);
        }
    }
}
