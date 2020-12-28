<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_booked',
        'time_booked',
        'total_price',
        'total_time',
        'appointment_location',
        'completed',
        'state',
    ];

    protected $table = 'customer_request';

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function service_request() {
        return $this->hasMany(ServiceRequest::class);
    }
}

