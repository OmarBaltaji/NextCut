<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Auth;

class ScheduleController extends Controller
{
    public function show() {
        $user = Auth::user();
        $barber = $user->barber->first(); // Only barbers have access to schedule
        $schedule = $barber->schedule;

        return response()->json($schedule, 200);
    }

    public function store(Request $request) {
       $attributes = $request->validate([
            'hour_open' => 'string|required',
            'hour_close' => 'string|required',
            'day_open'=> 'string|required',
            'day_close'=> 'string|required',
        ]);

        $user = Auth::user();
        $barber = $user->barber->first();

        $schedule = Schedule::create([
            'hour_open' => $attributes['hour_open'],
            'hour_close' => $attributes['hour_close'],
            'day_open' => $attributes['day_open'],
            'day_close' => $attributes['day_close'],
            'barber_id' => $barber->id,
        ]);

        return response()->json($schedule, 200);
    }

    public function update(Schedule $schedule, Request $request) {
       $attributes = $request->validate([
        'hour_open' => 'string|required',
        'hour_close' => 'string|required',
        'day_open'=> 'string|required',
        'day_close'=> 'string|required',
        ]);

        $schedule->update([
            'hour_open' => $attributes['hour_open'],
            'hour_close' => $attributes['hour_close'],
            'day_open' => $attributes['day_open'],
            'day_close' => $attributes['day_close'],
        ]);

        return response()->json($schedule, 200);
    }
}
