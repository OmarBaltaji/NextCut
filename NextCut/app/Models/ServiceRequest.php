<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'barber_service_id',
        'customer_request_id',
    ];

    protected $table = 'service_request';

    public function barber_service() {
        return $this->belongsTo(BarberService::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function customer_request() {
        return $this->belongsTo(CustomerRequest::class);
    }
}
