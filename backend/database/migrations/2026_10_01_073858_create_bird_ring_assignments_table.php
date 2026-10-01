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
        Schema::create('bird_ring_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bird_id')->constrained()->restrictOnDelete();
            $table->foreignId('ring_id')->constrained()->restrictOnDelete();
            $table->timestamp('assigned_at');
            $table->timestamp('unassigned_at')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(['bird_id', 'unassigned_at']);
            $table->index(['ring_id', 'unassigned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bird_ring_assignments');
    }
};
