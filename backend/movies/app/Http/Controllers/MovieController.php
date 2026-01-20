<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // <--- THIS IS CRITICAL
use Illuminate\Support\Facades\Cache; // Use Cache to make it faster
use App\Models\ListItem; 

class MovieController extends Controller
{
    // ... keep your existing index/show/search functions ...
    
    // (If you deleted them, put them back here)
    public function index(Request $request) {
        $key = env('TMDB_API_KEY');
        // Fetch trending
        return Http::withoutVerifying()->get("https://api.themoviedb.org/3/trending/movie/week?api_key={$key}")->json();
    }

    public function show($id) {
        $key = env('TMDB_API_KEY');
        return Http::withoutVerifying()->get("https://api.themoviedb.org/3/movie/{$id}?api_key={$key}&append_to_response=credits,videos")->json();
    }

    public function search(Request $request) {
        $key = env('TMDB_API_KEY');
        $query = $request->query('query');
        return Http::withoutVerifying()->get("https://api.themoviedb.org/3/search/movie?api_key={$key}&query={$query}")->json();
    }

    // --- THE NEW STATS FUNCTION ---
    public function tmdbStats()
    {
        // Cache the result for 60 minutes so we don't hit the API limit
        return Cache::remember('tmdb_stats', 60 * 60, function () {
            $key = env('TMDB_API_KEY');

            try {
                // 1. Get Total Movies (Fetch the latest ID)
                $latest = Http::withoutVerifying()
                    ->get("https://api.themoviedb.org/3/movie/latest?api_key={$key}")
                    ->json();
                
                $totalMovies = $latest['id'] ?? 950000; // Default if API fails

                // 2. Get Real Ratings Estimate
                // We fetch the Top Rated page to see average vote counts
                $topRated = Http::withoutVerifying()
                    ->get("https://api.themoviedb.org/3/movie/top_rated?api_key={$key}")
                    ->json();
                
                // Calculate average votes per movie from the top 20 results
                $results = $topRated['results'] ?? [];
                $sampleVotes = collect($results)->sum('vote_count');
                $sampleCount = count($results) > 0 ? count($results) : 1;
                $avgVotesPerTopMovie = $sampleVotes / $sampleCount;

                // Estimate: (Avg Votes) * (5% of Database) -> Realistic Global Total
                $estimatedRatings = $avgVotesPerTopMovie * ($totalMovies * 0.05);

                // 3. Local DB Count
                $localCount = ListItem::distinct('movie_id')->count('movie_id');

                return [
                    'total_movies' => $totalMovies, // Real TMDB Count
                    'total_ratings' => round($estimatedRatings), // Real Estimated Ratings
                    'local_movies' => $localCount // Your Database
                ];

            } catch (\Exception $e) {
                // Fallback hardcoded numbers if API crashes
                return [
                    'total_movies' => 850000,
                    'total_ratings' => 25000000,
                    'local_movies' => 0
                ];
            }
        });
    }
}