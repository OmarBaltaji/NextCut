<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Auth;

class CustomerController extends Controller
{
    public function store() {
        $user = Auth::user();

        Customer::create([ // To clarify that the authenticated user is a customer
            'user_id' => $user->id,
        ]);

        return response()->json('successful customer creation', 200);
    }
}
