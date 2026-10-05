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
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('reservation_application_id')->nullable()->change();
            $table->string('patron_title')->nullable()->after('customer_name');
            $table->string('location')->nullable()->after('patron_title');
            $table->string('individual_ref')->nullable()->after('location');
            $table->string('video_path')->nullable()->after('body');
            $table->text('video_url')->nullable()->after('video_path');
            $table->string('video_thumbnail')->nullable()->after('video_url');
            $table->boolean('verified')->default(true)->after('status');
            $table->timestamp('submitted_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn([
                'patron_title',
                'location',
                'individual_ref',
                'video_path',
                'video_url',
                'video_thumbnail',
                'verified',
            ]);
            $table->foreignId('reservation_application_id')->nullable(false)->change();
        });
    }
};
