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
}
