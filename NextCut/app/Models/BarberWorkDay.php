<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarberWorkDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_day_id',
        'barber_id',
    ];
}
