<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MovieList;
use App\Models\ListItem;
use Illuminate\Http\Request;

class ListController extends Controller
{
    // 1. Get all lists for the logged-in user
    public function getUserLists(Request $request)
    {
        $lists = MovieList::where('user_id', $request->user()->id)
                          ->with('items') // <--- ADD THIS: Get the movies inside
                          ->withCount('items')
                          ->orderBy('created_at', 'desc')
                          ->get();
                          
        return response()->json($lists);
    }

    // 2. Create a new list (e.g., "Horror Movies")
    public function createList(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $list = MovieList::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description ?? '',
        ]);

        return response()->json($list, 201);
    }

    // 3. Add a movie to a specific list
    public function addMovieToList(Request $request, $listId)
    {
        // 1. Validate Input
        $request->validate([
            'movie_id' => 'required|integer',
            'movie_title' => 'required|string',
            'poster_path' => 'nullable|string'
        ]);

        try {
            // 2. Find the List
            $list = MovieList::where('id', $listId)
                             ->where('user_id', $request->user()->id)
                             ->first();

            if (!$list) {
                return response()->json(['message' => 'List not found'], 404);
            }

            // 3. Check for Duplicates
            // (Ensure your Model name 'ListItem' matches your file name!)
            $exists = ListItem::where('movie_list_id', $list->id)
                              ->where('movie_id', $request->movie_id)
                              ->exists();

            if ($exists) {
                return response()->json(['message' => 'Movie already in list'], 409);
            }

            // 4. Get Runtime from TMDB (Optional, handles failure gracefully)
            $runtime = 0;
            try {
                $key = env('TMDB_API_KEY');
                $res = \Illuminate\Support\Facades\Http::withoutVerifying()
                    ->timeout(2)
                    ->get("https://api.themoviedb.org/3/movie/{$request->movie_id}?api_key={$key}");
                if ($res->successful()) $runtime = $res['runtime'] ?? 0;
            } catch (\Exception $e) { 
                $runtime = 0; 
            }

            // 5. Create the Item
            ListItem::create([
                'movie_list_id' => $list->id,
                'movie_id' => $request->movie_id,
                'movie_title' => $request->movie_title,
                'poster_path' => $request->poster_path,
                'runtime' => $runtime
            ]);

            return response()->json(['message' => 'Added successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
   public function deleteList($id, Request $request)
    {
        try {
            // 1. Verify Ownership (Security)
            $list = MovieList::where('id', $id)
                             ->where('user_id', $request->user()->id)
                             ->first();

            if (!$list) {
                return response()->json(['message' => 'List not found or access denied'], 404);
            }

            // 2. DELETE ITEMS (Using exact names from your migration)
            // Table: 'list_items' | Column: 'movie_list_id'
            DB::table('list_items')->where('movie_list_id', $id)->delete();

            // 3. DELETE LIST
            $list->delete();

            return response()->json(['message' => 'List deleted successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getWatchTime(Request $request)
    {
        // 1. Find the user's "Watched" list (or you can sum ALL lists)
        // Let's assume we sum ALL movies in ALL lists for this user
        // (Or filter by name: where('name', 'Watched'))
        
        $lists = MovieList::where('user_id', $request->user()->id)->with('items')->get();
        
        $totalMinutes = 0;

        foreach ($lists as $list) {
            // Only count if list name is 'Watched' (Optional: remove if checking all)
            if (strtolower($list->name) === 'watched') {
                $totalMinutes += $list->items->sum('runtime');
            }
        }

        $hours = floor($totalMinutes / 60);
        $minutes = $totalMinutes % 60;

        return response()->json([
            'total_minutes' => $totalMinutes,
            'formatted' => "{$hours}h {$minutes}m"
        ]);
    }
}