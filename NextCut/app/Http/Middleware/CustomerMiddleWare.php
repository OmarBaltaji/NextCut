<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;

class CustomerMiddleWare
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
        ddd(Auth::user());
        $role = Auth::user()->roles;

        if($role != 'Customer') {
            return view('/home');
            //403 because the user identidy is know but is not given access because of role
        }

        return $next($request);
    }
}
