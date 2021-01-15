<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class BarberController extends Controller
{
    public function index() {
        $barbers = Barber::all();

        foreach($barbers as $barber) {
            $barber->user->address;
            $barber->barber_service;
        }

        return $barbers;
    }

    public function show(Barber $barber) {
        $barber->user->address->flatten();
        return response()->json($barber, 200);
    }

    public function services(Barber $barber) {
        $barber_services = $barber->barber_service;

        foreach($barber_services as $barber_service) {
            $barber_service->service;
        }

        return response()->json($barber_services, 200);
    }

    public function barberSchedule(Barber $barber) {
        $schedule = $barber->schedule->first();
        return response()->json($schedule, 200);
    }

    public function barberGallery(Barber $barber) {
        $gallery = $barber->gallery;
        return response()->json($gallery, 200);
    }

    public function barberServiceDetails(Barber $barber) {
        $barberservices = $barber->barber_service;

        foreach($barberservices as $barberservice) {
            $barberservice->service;
        }

        return response()->json($barberservices, 200);

    }

    public function searchedBarber(Request $request) {
        $attribute = $request->validate([
            'searched_name' => 'string|required'
        ]);

        $listOfBarbers = DB::table('users')
                    ->where('name', 'like', '%' . $attribute['searched_name'] . '%')
                    ->where('roles', '=', 'Barber')
                    ->get();

        $searched_barbers = [];
        if (sizeof($listOfBarbers) > 1) {
            foreach($listOfBarbers as $oneBarber) {
                $searched_barber = User::find($oneBarber->id);
                $searched_barber->address;
                $searched_barber->barber;
                array_push($searched_barbers, $searched_barber);
            }
        }
        else {
            $searched_barber = User::find($listOfBarbers->first()->id);
            $searched_barber->address;
            $searched_barber->barber;
            array_push($searched_barbers, $searched_barber);
        }

        return response()->json($searched_barbers, 200);
    }
}
