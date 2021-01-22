<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Auth;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function show() {
        $user = Auth::user();
        $address = $user->address;
        return response()->json($address, 200);
    }

    public function store(Request $request) {
        $attributes = $request->validate([
            'city' => 'string|required',
            'street' => 'string|required',
            'building' => 'string|required',
            'near'=> 'string|required',
        ]);

        $barber = Address::create([
            'city' => $attributes['city'],
            'street' => $attributes['street'],
            'building' => $attributes['building'],
            'near' => $attributes['near'],
            'user_id' => Auth::user()->id,
        ]);

        return response()->json($barber, 200);
    }

    public function update(Address $address, Request $request) {
        $attributes = $request->validate([
            'city' => 'string|required',
            'street' => 'string|required',
            'building' => 'string|required',
            'near'=> 'string|required',
            'user_id' => '',
        ]);

        $address->update([
            'city' => $attributes['city'],
            'street' => $attributes['street'],
            'building' => $attributes['building'],
            'near' => $attributes['near'],
        ]);

        return response()->json($address, 200);
    }

    public function showCustomerAddress() {
        $user = Auth::user();
        $address = $user->address;
        return response()->json($address, 200);
    }

    public function storeCustomerAddress(Request $request) {
        $attributes = $request->validate([
            'city' => 'string|required',
            'street' => 'string|required',
            'building' => 'string|required',
            'near'=> 'string|required',
        ]);

        $customerAddress = Address::create([
            'city' => $attributes['city'],
            'street' => $attributes['street'],
            'building' => $attributes['building'],
            'near' => $attributes['near'],
            'user_id' => Auth::user()->id,
        ]);

        return response()->json($customerAddress, 200);
    }

    public function updateCustomerAddress(Address $address, Request $request) {
        $attributes = $request->validate([
            'city' => 'string|required',
            'street' => 'string|required',
            'building' => 'string|required',
            'near'=> 'string|required',
            'user_id' => '',
        ]);

        $address->update([
            'city' => $attributes['city'],
            'street' => $attributes['street'],
            'building' => $attributes['building'],
            'near' => $attributes['near'],
        ]);

        return response()->json($address, 200);
    }
}
