<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('list_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('movie_list_id')->constrained('movie_lists')->onDelete('cascade');
        
        // We store basic movie info so we don't have to fetch TMDB every time we view a list
        $table->unsignedBigInteger('movie_id'); // The ID from TMDB (e.g. 550)
        $table->string('movie_title');
        $table->string('poster_path')->nullable();
        
        $table->timestamps();
        
        // Prevent adding the same movie to the same list twice
        $table->unique(['movie_list_id', 'movie_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_items');
    }
};
