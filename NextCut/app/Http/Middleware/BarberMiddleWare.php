<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;

class BarberMiddleWare
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $role = Auth::user()->roles;

        if($role != 'Barber') {
            return response()->json(['message' => 'you are not authorized to view this page'], 403);
            //403 because the user identidy is know but is not given access because of role
        }

        return $next($request);
    }
}
