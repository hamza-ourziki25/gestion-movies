<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ListItem; // <--- 1. IMPORT THIS

class MovieList extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'description', 'is_public'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A List has many Items
    public function items()
    {
        // 2. DEFINE THE RELATIONSHIP EXPLICITLY
        // 'movie_list_id' is the column name in the items table.
        // If your database uses 'list_id', CHANGE 'movie_list_id' to 'list_id' below!
        return $this->hasMany(ListItem::class, 'movie_list_id', 'id');
    }
}