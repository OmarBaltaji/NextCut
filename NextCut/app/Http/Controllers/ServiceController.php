<?php

namespace App\Http\Controllers;

use App\Models\BarberService;
use App\Models\Service;
use Auth;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function show() {
        $user = Auth::user();
        $barber = $user->barber->first();
        $barber_services = $barber->barber_service;

        $services = [];

        foreach($barber_services as $barber_service) {
            array_push($services, $barber_service->service);
        }

        return response()->json($services, 200);
    }

    public function create(Request $request) {
        $attributes = $request->validate([
            'type' => 'string|required',
        ]);

        $service = Service::create([
            'type' => $attributes['type'],
        ]);

        $user = Auth::user();

        $barber = $user->barber->first();

        $attrs = $request->validate([
            'price' => 'string|required',
            'estimated_time' => 'string|required',
            'service_id' => 'integer|required',
        ]);

        $barber_service = BarberService::create([
            'price' => $attrs['price'],
            'estimated_time' => $attrs['estimated_time'],
            'barber_id' => $barber->id,
            'service_id' => $attrs['service_id'],
        ]);

        return response()->json($barber_service, 200);
    }

    public function update(Service $service, Request $request) {

    }
}
