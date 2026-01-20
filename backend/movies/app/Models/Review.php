<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'movie_id', 'movie_title', 'poster_path', 'rating', 'content'
    ];

    // A Review belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}