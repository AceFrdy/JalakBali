<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            if (Schema::hasColumn('birds', 'health_care_info')) {
                $table->dropColumn('health_care_info');
            }
        });
    }

    public function down(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            $table->text('health_care_info')->nullable();
        });
    }
};
