<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarberService extends Model
{
    use HasFactory;

    protected $fillable = [
        'price',
        'estimated_time',
        'barber_id',
        'service_id',
    ];

    protected $table = 'barber_service';

    public function barber() {
        return $this->belongsToMany(Barber::class);
    }
}
