<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            if (!Schema::hasColumn('birds', 'certificate_images')) {
                $table->json('certificate_images')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            if (Schema::hasColumn('birds', 'certificate_images')) {
                $table->dropColumn('certificate_images');
            }
        });
    }
};
