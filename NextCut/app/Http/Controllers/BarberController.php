<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use Illuminate\Http\Request;

class BarberController extends Controller
{
    public function index() {
        $barbers = Barber::all();

        foreach($barbers as $barber) {
            $barber->user->address;
        }

        return $barbers;
    }

    public function show(Barber $barber) {
        $barber->user->address->flatten();
        return response()->json($barber, 200);
    }

    public function services(Barber $barber) {
        $barber->service;
        $barber->barber_service;
        return response()->json($barber, 200);
    }

    public function barberSchedule(Barber $barber) {
        $schedule = $barber->schedule->first();
        return response()->json($schedule, 200);
    }

    public function barberGallery(Barber $barber) {
        $gallery = $barber->gallery;
        return response()->json($gallery, 200);
    }
}
