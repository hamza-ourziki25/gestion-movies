<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // Toggle Favorite (Like/Unlike)
    public function toggle(Request $request)
    {
        $user = $request->user();
        
        // Check if exists
        $fav = Favorite::where('user_id', $user->id)
                       ->where('movie_id', $request->movie_id)
                       ->first();

        if ($fav) {
            $fav->delete();
            return response()->json(['status' => 'removed']);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'movie_id' => $request->movie_id,
                'movie_title' => $request->movie_title,
                'poster_path' => $request->poster_path
            ]);
            return response()->json(['status' => 'added']);
        }
    }

    // Check if a specific movie is favorited (for the button color)
    public function check($movieId, Request $request)
    {
        $exists = Favorite::where('user_id', $request->user()->id)
                          ->where('movie_id', $movieId)
                          ->exists();
        return response()->json(['is_favorite' => $exists]);
    }

    // Get all favorites (For Profile Page)
    public function index(Request $request)
    {
        return response()->json($request->user()->favorites()->latest()->get());
    }
}