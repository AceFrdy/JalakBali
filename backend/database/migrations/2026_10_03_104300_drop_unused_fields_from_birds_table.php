<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('birds', 'microchip_id')) {
                $columnsToDrop[] = 'microchip_id';
            }
            if (Schema::hasColumn('birds', 'documentation_status')) {
                $columnsToDrop[] = 'documentation_status';
            }
            if (Schema::hasColumn('birds', 'legal_note')) {
                $columnsToDrop[] = 'legal_note';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    public function down(): void
    {
        Schema::table('birds', function (Blueprint $table) {
            $table->string('microchip_id')->nullable();
            $table->string('documentation_status')->nullable();
            $table->text('legal_note')->nullable();
        });
    }
};
