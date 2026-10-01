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
        Schema::create('catalog_items', function (Blueprint $table) {
            $table->id();
            $table->string('external_id', 120)->unique();
            $table->string('kind', 20);
            $table->string('name');
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('deposit');
            $table->string('availability_status', 30)->default('available');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['kind', 'availability_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_items');
    }
};
