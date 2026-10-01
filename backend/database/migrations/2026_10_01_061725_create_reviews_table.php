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
            $table->foreignId('reservation_application_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->unsignedTinyInteger('rating');
            $table->string('customer_name');
            $table->string('status', 20)->default('pending');
            $table->text('moderation_note')->nullable();
            $table->timestamp('submitted_at');
            $table->timestamp('moderated_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'submitted_at']);
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
