<?php

namespace App\Http\Controllers;

use App\Models\Barber;

class BarberController extends Controller
{
    public function index() {
        $barbers = Barber::all(); // Get all barbers

        foreach($barbers as $barber) {
            $barber->user->address; // Get each barber's address
            $barber->barber_service; // Get each barber's services
        }

        return response()->json($barbers, 200);
    }

    public function show(Barber $barber) {
        $barber->user->address->flatten(); // Get address of the chosen barber only
        return response()->json($barber, 200); // Returns Barber's information (such as salon name and address)
    }

    public function services(Barber $barber) {
        $barber_services = $barber->barber_service; // Get the services of the chosen barber only

        foreach($barber_services as $barber_service) {
            $barber_service->service; // Get type for each service provided by the barber
        }

        return response()->json($barber_services, 200);
    }

    public function barberSchedule(Barber $barber) {
        $schedule = $barber->schedule->first(); // Get the schedule of the chosen barber only
        return response()->json($schedule, 200);
    }

    public function barberGallery(Barber $barber) {
        $gallery = $barber->gallery;  // Get the gallery of the chosen barber only
        return response()->json($gallery, 200);
    }
}
