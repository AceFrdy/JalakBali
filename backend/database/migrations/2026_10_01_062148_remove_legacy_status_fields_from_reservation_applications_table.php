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
        Schema::table('reservation_applications', function (Blueprint $table) {
            $table->dropIndex(['verification_status', 'payment_status']);
            $table->dropColumn(['verification_status', 'transaction_state']);
            $table->index('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_applications', function (Blueprint $table) {
            $table->string('verification_status', 30)->default('pending');
            $table->string('transaction_state', 40)->default('documentation_submitted');
            $table->dropIndex(['payment_status']);
            $table->index(['verification_status', 'payment_status']);
        });
    }
};
