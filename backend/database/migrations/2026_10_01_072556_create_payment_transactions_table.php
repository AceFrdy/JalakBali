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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code', 40)->unique();
            $table->foreignId('application_id')->nullable()->constrained('reservation_applications')->restrictOnDelete();
            $table->string('customer_id', 120)->nullable();
            $table->string('type', 30);
            $table->string('payment_method', 30);
            $table->string('provider', 40);
            $table->string('provider_transaction_id', 160)->nullable();
            $table->string('idempotency_key', 255)->nullable()->unique();
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3)->default('IDR');
            $table->string('status', 30)->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->foreignId('parent_transaction_id')->nullable()->constrained('payment_transactions')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->string('application_code_snapshot', 32)->nullable();
            $table->string('customer_name_snapshot')->nullable();
            $table->string('customer_email_snapshot')->nullable();
            $table->string('bird_id_snapshot', 120)->nullable();
            $table->string('bird_name_snapshot')->nullable();
            $table->string('ring_number_snapshot', 120)->nullable();
            $table->string('pair_id_snapshot', 120)->nullable();
            $table->string('pair_name_snapshot')->nullable();
            $table->string('release_id_snapshot', 120)->nullable();
            $table->string('release_name_snapshot')->nullable();
            $table->unsignedBigInteger('price_snapshot')->nullable();
            $table->unsignedBigInteger('deposit_snapshot')->nullable();
            $table->timestamps();

            $table->index(['application_id', 'status']);
            $table->index(['provider', 'provider_transaction_id']);
            $table->index(['type', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
