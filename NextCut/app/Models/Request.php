<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'completed',
        'state',
        'customer_id',
    ];

    public function user() {
        return $this->belongsTo(Customer::class);
    }

}
