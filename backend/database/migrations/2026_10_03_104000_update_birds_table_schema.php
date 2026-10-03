<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            if (Schema::hasColumn('birds', 'public_id') && !Schema::hasColumn('birds', 'tagging')) {
                $table->renameColumn('public_id', 'tagging');
            } elseif (!Schema::hasColumn('birds', 'tagging')) {
                $table->string('tagging', 120)->nullable()->unique();
            }

            if (Schema::hasColumn('birds', 'name')) {
                $table->dropColumn('name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            if (Schema::hasColumn('birds', 'tagging')) {
                $table->renameColumn('tagging', 'public_id');
            }
            if (!Schema::hasColumn('birds', 'name')) {
                $table->string('name')->nullable();
            }
        });
    }
};
