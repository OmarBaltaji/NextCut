<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
    ];

    protected $table = 'services';

    public function barber() {
        return $this->belongsToMany(Barber::class);
    }

    public function barber_service() {
        return $this->hasMany(BarberService::class);
    }
}
