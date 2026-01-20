<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ReviewController; // Combined imports
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\Auth\ForgotPasswordController;

Route::get('/', function () {
    return view('welcome');
});

// Public Routes
Route::get('/movie', [MovieController::class, 'index']);
Route::get('/movie/{id}', [MovieController::class, 'show']);
Route::get('/search', [MovieController::class, 'search']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Test API Route
Route::get('/test-api', function() {
    $key = env('TMDB_API_KEY');
    if (!$key) return "ERROR: API Key missing.";
    try {
        $response = Http::withoutVerifying()->get("https://api.themoviedb.org/3/movie/238?api_key={$key}");
        return $response->json();
    } catch (\Exception $e) {
        return "CRASH: " . $e->getMessage();
    }
});

// --- PROTECTED ROUTES (MUST BE LOGGED IN) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // User
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [AuthController::class, 'updateProfile']);

    // Lists
    Route::get('/my-lists', [ListController::class, 'getUserLists']);
    Route::post('/lists', [ListController::class, 'createList']);
    Route::post('/lists/{id}/add', [ListController::class, 'addMovieToList']);
    
    // *** FIX IS HERE: The Delete route MUST be inside this group ***
    Route::delete('/lists/{id}', [ListController::class, 'deleteList']); 

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Favorites
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites/check/{id}', [FavoriteController::class, 'check']);
    Route::get('/my-favorites', [FavoriteController::class, 'index']);

    Route::get('/user/watch-time', [ListController::class, 'getWatchTime']);
});

// Place this near the top with your other public routes
Route::get('/public-stats', [MovieController::class, 'stats']);

Route::get('/tmdb-stats', [MovieController::class, 'tmdbStats']);


Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);