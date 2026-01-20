<?php

namespace App\Models;

// 1. THIS LINE MUST BE HERE:
use Laravel\Sanctum\HasApiTokens; 

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // 2. AND THIS LINE MUST BE INSIDE THE CLASS:
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'username',
        'email',
        'phone',
        'age',
        'country',
        'city',
        'password',
        'avatar',
        'banner',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}