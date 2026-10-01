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
        Schema::create('weekly_releases', function (Blueprint $table) {
            $table->id();
            $table->string('external_id', 120)->unique();
            $table->date('release_date');
            $table->string('status', 20);
            $table->unsignedInteger('available_single')->default(0);
            $table->unsignedInteger('available_pair')->default(0);
            $table->json('individual_bird_ids')->nullable();
            $table->json('pair_ids')->nullable();
            $table->string('handover_estimate');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_releases');
    }
};
