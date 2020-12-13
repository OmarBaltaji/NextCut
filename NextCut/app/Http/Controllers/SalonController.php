<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use Illuminate\Http\Request;
use Auth;

class SalonController extends Controller
{
    public function store(Request $request) {

       $attributes = $request->validate([
            'salon_name' => 'string|required',
            'hour_open' => 'string|required',
            'hour_close' => 'string|required',
            'day_open'=> 'string|required',
            'day_close'=> 'string|required',
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
}
