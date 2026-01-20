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
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        
        // Movie Data
        $table->unsignedBigInteger('movie_id');
        $table->string('movie_title');
        $table->string('poster_path')->nullable();
        
        // Review Data
        $table->integer('rating'); // 1 to 5 stars
        $table->text('content')->nullable(); // The actual text
        
        $table->timestamps();
        $table->unique(['user_id', 'movie_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
