<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barber extends Model
{
    use HasFactory;

    protected $fillable = [
        'salon_name',
        'hour_open',
        'hour_close',
        'day_open',
        'day_close',
        'user_id',
    ];

    public function schedule() {
        return $this->hasMany(Schedule::class);
    }

    public function workday() {
        return $this->belongsToMany(WorkDay::class);
    }

    public function barberWorkday() {
        return $this->hasMany(BarberWorkDay::class);
    }

    public function gallery() {
        return $this->hasMany(Gallery::class);
    }

    public function service() {
        return $this->belongsToMany(Service::class);
    }

    public function barber_service() {
        return $this->hasMany(BarberService::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
