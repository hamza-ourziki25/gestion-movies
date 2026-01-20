<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TmdbService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        // 1. DEFINE THE VARIABLES HERE
        $this->baseUrl = 'https://api.themoviedb.org/3';
        $this->apiKey = env('TMDB_API_KEY'); 
    }

    public function getPopularMovies()
    {
        // 2. USE THE VARIABLES ($this->baseUrl)
        return Http::withoutVerifying()->get("{$this->baseUrl}/movie/popular", [
            'api_key' => $this->apiKey
        ])->json();
    }

    public function searchMovie($query)
    {
        return Http::withoutVerifying()->get("{$this->baseUrl}/search/movie", [
            'api_key' => $this->apiKey,
            'query' => $query
        ])->json();
    }

    public function getPopularAnime()
    {
        return Http::withoutVerifying()->get("{$this->baseUrl}/discover/tv", [
            'api_key' => $this->apiKey,
            'with_genres' => 16,
            'with_original_language' => 'ja',
            'sort_by' => 'popularity.desc'
        ])->json();
    }

    public function getMovieDetails($id)
    {
        return Http::withoutVerifying()->get("{$this->baseUrl}/movie/{$id}", [
            'api_key' => $this->apiKey,
            'append_to_response' => 'credits,similar'
        ])->json();
    }
}