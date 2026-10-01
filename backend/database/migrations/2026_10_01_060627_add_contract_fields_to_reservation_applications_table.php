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
            $table->string('application_status', 30)->default('submitted')->after('booking_code');
            $table->string('document_verification_status', 30)->default('pending')->after('application_status');
            $table->string('review_status', 30)->default('not_started')->after('document_verification_status');
            $table->string('customer_access_token_hash')->nullable()->after('review_status');
            $table->timestamp('customer_access_token_expires_at')->nullable()->after('customer_access_token_hash');
            $table->index(['application_status', 'document_verification_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_applications', function (Blueprint $table) {
            $table->dropIndex(['application_status', 'document_verification_status']);
            $table->dropColumn([
                'application_status',
                'document_verification_status',
                'review_status',
                'customer_access_token_hash',
                'customer_access_token_expires_at',
            ]);
        });
    }
};
