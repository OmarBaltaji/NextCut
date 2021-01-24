<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use Illuminate\Http\Request;
use Auth;

class SalonController extends Controller
{
    public function show() {
        $user = Auth::user();
        $barber = $user->barber; // Salon's information is known once we know which barber the user is logged in as
        return response()->json($barber, 200);
    }

    public function store(Request $request) {
       $attributes = $request->validate([
            'salon_name' => 'required',
            'hour_open' => 'required',
            'hour_close' => 'required',
            'day_open'=> 'required',
            'day_close'=> 'required',
        ]);

        $barber = Barber::create([
            'salon_name' => $attributes['salon_name'],
            'hour_open' => $attributes['hour_open'],
            'hour_close' => $attributes['hour_close'],
            'day_open' => $attributes['day_open'],
            'day_close' => $attributes['day_close'],
            'user_id' => Auth::user()->id,
        ]);

        return response()->json($barber, 200);
    }

    public function update(Barber $barber, Request $request) {
       $attributes = $request->validate([
        'salon_name' => 'required',
        'hour_open' => 'required',
        'hour_close' => 'required',
        'day_open'=> 'required',
        'day_close'=> 'required',
        ]);

        $barber->update([
            'salon_name' => $attributes['salon_name'],
            'hour_open' => $attributes['hour_open'],
            'hour_close' => $attributes['hour_close'],
            'day_open' => $attributes['day_open'],
            'day_close' => $attributes['day_close'],
        ]);

        return response()->json($barber, 200);
    }
}
