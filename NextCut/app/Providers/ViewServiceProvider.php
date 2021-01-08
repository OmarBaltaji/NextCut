<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use App\Http\View\Composers\ProfileComposer;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // View::composer('layouts.app', function ($view)  {
            if (Auth::check()) {
                // The user is logged in...
                $notifications = Auth::user()->notifications()->select('id','data','created_at','read_at')->get();
                $notificationCount = Auth::user()->unreadNotifications()->count();
                // $view->with(['notifications' => $notifications, 'notificationCount' => $notificationCount]);
                return response()->json(['notification' => $notifications, 'notificationCount' => $notificationCount], 200);
            }

        // });
    }
}
