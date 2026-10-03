<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bird_pairs', function (Blueprint $table) {
            $table->id();
            $table->string('pair_tag', 60)->unique();
            $table->foreignId('bird_a_id')->constrained('birds')->restrictOnDelete();
            $table->foreignId('bird_b_id')->constrained('birds')->restrictOnDelete();
            $table->string('status', 30)->default('available');
            $table->boolean('show_on_homepage')->default(false);
            $table->unsignedBigInteger('price')->nullable();
            $table->unsignedBigInteger('deposit')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['status', 'show_on_homepage']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bird_pairs');
    }
};
