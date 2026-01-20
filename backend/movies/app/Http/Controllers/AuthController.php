<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. VALIDATION (Double Security)
        // We validate here even if React already validated.
        $validatedData = $request->validate([
            // Full Name: Letters and spaces only
            'fullName' => ['required', 'regex:/^[a-zA-Z\s]+$/'],
            
            // Username: Alpha numeric and Unique in DB
            'username' => ['required', 'alpha_num', 'unique:users,username'],
            
            // Email: Standard email validation + Unique
            'email'    => ['required', 'email', 'unique:users,email'],
            
            // Phone: Exactly 10 digits
            'phone'    => ['required', 'digits:10'],
            
            // Age: Integer and MUST be 18 or higher
            'age'      => ['required', 'integer', 'min:18'],
            
            // Password: Min 8 chars
            'password' => ['required', 'string', 'min:8'],
            
            'country'  => ['required', 'string'],
            'city'     => ['required', 'string'],
        ]);

        // 2. CREATE USER
        // Note: We map React's "fullName" to DB's "full_name"
        $user = User::create([
            'full_name' => $validatedData['fullName'], 
            'username'  => $validatedData['username'],
            'email'     => $validatedData['email'],
            'phone'     => $validatedData['phone'],
            'age'       => $validatedData['age'],
            'country'   => $validatedData['country'],
            'city'      => $validatedData['city'],
            'password'  => Hash::make($validatedData['password']),
        ]);

        // 3. GENERATE TOKEN (For auto-login after register)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. RETURN RESPONSE
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        // Check email
        $user = User::where('email', $fields['email'])->first();

        // Check password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->id,
            'password' => 'nullable|string|min:8',
            'avatar'   => 'nullable|string', // We will accept Image URLs for now
            'banner'   => 'nullable|string',
            'bio'      => 'nullable|string|max:500',
        ]);

        // Update basic info
        $user->username = $request->username;
        
        if ($request->avatar) $user->avatar = $request->avatar;
        if ($request->banner) $user->banner = $request->banner;

        // Update password ONLY if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->has('bio')) {
            $user->bio = $request->bio;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}