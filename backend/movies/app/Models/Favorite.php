<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'movie_id',
        'movie_title',
        'poster_path',
    ];
}
