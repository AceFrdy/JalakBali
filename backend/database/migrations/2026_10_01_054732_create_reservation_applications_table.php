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
        Schema::create('reservation_applications', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 32)->unique();
            $table->string('reservation_type', 20);
            $table->string('weekly_release_id', 120);
            $table->string('bird_id', 120)->nullable();
            $table->string('pair_id', 120)->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 40);
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('handover_method', 60)->nullable();
            $table->string('payment_type', 20)->default('deposit');
            $table->string('payment_method', 30);
            $table->unsignedBigInteger('price')->nullable();
            $table->unsignedBigInteger('deposit_amount')->nullable();
            $table->unsignedBigInteger('remaining_amount')->nullable();
            $table->string('verification_status', 30)->default('pending');
            $table->string('payment_status', 30)->default('pending');
            $table->string('transaction_state', 40)->default('documentation_submitted');
            $table->timestamp('hold_expires_at')->nullable();
            $table->timestamp('handover_date')->nullable();
            $table->timestamps();

            $table->index(['verification_status', 'payment_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_applications');
    }
};
