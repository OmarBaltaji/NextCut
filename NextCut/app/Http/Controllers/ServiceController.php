<?php

namespace App\Http\Controllers;

use App\Models\BarberService;
use App\Models\Service;
use Auth;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // The difference between services and barber's services is that services are the type of service a barber might provide
    // such as (Spiky, Regular Haircut...), whereas barber's services constitute of the service's type, price and duration

    public function showAllServices() {
        $services = Service::all();

        return response()->json($services, 200); // Returns all available services (services are common between all barbers)
    }

    public function showBarberService() {
        $user = Auth::user();
        $barber = $user->barber->first();
        $barber_services = $barber->barber_service; // Shows the services provided by this particular barber

        foreach($barber_services as $barber_service) {
            $barber_service->service;
        }

        return response()->json($barber_services, 200);
    }

    public function storeService(Request $request) { // Can create new service type (which can be used by others)
        $attributes = $request->validate([
            'type' => 'string|required',
        ]);

        $service = Service::create([
            'type' => $attributes['type'],
        ]);

        return response()->json($service, 200);
    }

    public function storeBarberService(Request $request) { // Create a new service for a particular barber
        $user = Auth::user();

        $barber = $user->barber->first();

        $attrs = $request->validate([
            'price' => 'integer|required',
            'estimated_time' => 'integer|required',
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

    public function updateBarberService(BarberService $barberService, Request $request) { // Update a service for a particular barber
        $attrs = $request->validate([
            'price' => 'integer|required',
            'estimated_time' => 'integer|required',
            'service_id' => 'integer|required',
        ]);

        $barberService->update([
            'price' => $attrs['price'],
            'estimated_time' => $attrs['estimated_time'],
            'service_id' => $attrs['service_id'],
        ]);

        return response()->json($barberService, 200);
    }

    public function deleteBarberService(BarberService $barberService) { // Delete a service for a particular barber
        $barberService->delete();
        return response()->json(['message' => 'deleted successfully'], 200);
    }
}
