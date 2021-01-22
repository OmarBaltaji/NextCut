<?php

namespace App\Http\Controllers;

use App\Models\Barber;

class BarberController extends Controller
{
    public function index() { //show all barbers
        $barbers = Barber::all();

        foreach($barbers as $barber) {
            $barber->user->address; //get the barbers' address
            $barber->barber_service; //get the services provided by the barbers
        }

        return $barbers;
    }

    public function show(Barber $barber) { //show the chosen barber
        $barber->user->address->flatten();
        return response()->json($barber, 200);
    }

    public function services(Barber $barber) { //get the services of the chosen barber
        $barber_services = $barber->barber_service;

        foreach($barber_services as $barber_service) {
            $barber_service->service;
        }

        return response()->json($barber_services, 200);
    }

    public function barberSchedule(Barber $barber) { //get the schedule of the chosen barber
        $schedule = $barber->schedule->first();
        return response()->json($schedule, 200);
    }

    public function barberGallery(Barber $barber) { //get the gallery of the chosen barber
        $gallery = $barber->gallery;
        return response()->json($gallery, 200);
    }
}
