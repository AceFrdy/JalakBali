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
        Schema::create('birds', function (Blueprint $table) {
            $table->id();
            $table->string('public_id', 120)->unique();
            $table->string('name');
            $table->string('sex', 20);
            $table->date('hatch_date')->nullable();
            $table->string('status', 30)->default('available');
            $table->unsignedBigInteger('price')->nullable();
            $table->unsignedBigInteger('deposit')->nullable();
            $table->string('breeding_line')->nullable();
            $table->text('health_care_info')->nullable();
            $table->string('microchip_id')->nullable();
            $table->string('documentation_status', 40)->default('pending');
            $table->text('legal_note')->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();

            $table->index(['status', 'sex']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('birds');
    }
};
