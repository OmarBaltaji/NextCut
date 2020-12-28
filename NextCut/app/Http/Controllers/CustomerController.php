<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Auth;

class CustomerController extends Controller
{
    public function store() {
        $user = Auth::user();

        Customer::create([
            'user_id' => $user->id,
        ]);

        return response()->json('successful customer creation', 200);
    }
}
