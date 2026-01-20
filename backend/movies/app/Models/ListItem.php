<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListItem extends Model
{
    use HasFactory;

    // 1. FORCE THE TABLE NAME
    // Look at your database (phpMyAdmin). 
    // If your table is named 'items', change this to 'items'.
    // If it is named 'list_items', keep it 'list_items'.
    protected $table = 'list_items'; 

    protected $fillable = [
        'movie_list_id', // This must match the column name in your database!
        'movie_id', 
        'movie_title', 
        'poster_path',
        'runtime'
    ];
}