<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'hour_open',
        'hour_close',
        'day_open',
        'day_close',
        'barber_id',
    ];

    public function barber() {
        return $this->belongsTo(Barber::class);
    }
}
