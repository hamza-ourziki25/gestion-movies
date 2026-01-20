<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // 1. Get All Reviews (The Feed)
    public function index()
    {
        $reviews = Review::with('user') // Get the user info too
                         ->orderBy('created_at', 'desc') // Newest first
                         ->paginate(20); // Load 20 at a time
                         
        return response()->json($reviews);
    }

    // 2. Create a Review
    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|integer',
            'movie_title' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string'
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'movie_id' => $request->movie_id,
            'movie_title' => $request->movie_title,
            'poster_path' => $request->poster_path,
            'rating' => $request->rating,
            'content' => $request->content
        ]);

        return response()->json($review, 201);
    }
}