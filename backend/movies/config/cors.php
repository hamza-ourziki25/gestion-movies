<?php

use Illuminate\Support\Str;

// config/cors.php

// config/cors.php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 1. ADD 'movies' HERE (or just keep 'api/*' and '*')
    'paths' => ['*'],
    
    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'], // This allows localhost:3000

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
]; 