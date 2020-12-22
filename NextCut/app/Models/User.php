<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    // protected $appends = ['profile_picture_url'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'profile_photo',
        'phone_number',
        'email',
        'password',
        'roles',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function barber() {
        return $this->hasMany(Barber::class);
    }

    public function customer() {
        return $this->hasMany(Customer::class);
    }

    public function address() {
        return $this->hasMany(Address::class);
    }

    // public function getProfilePictureUrlAttribute(){
    //     return Storage::url(env('PROFILE_PICTURES_PATH') . $this->id . '/' .$this->profile_photo);
    // }
}
