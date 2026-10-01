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
        Schema::create('rings', function (Blueprint $table) {
            $table->id();
            $table->string('ring_number', 120);
            $table->string('normalized_ring_number', 120);
            $table->string('issuing_authority', 160)->default('Jalak Bali Registry');
            $table->string('status', 30)->default('active');
            $table->date('registered_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['issuing_authority', 'normalized_ring_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rings');
    }
};
