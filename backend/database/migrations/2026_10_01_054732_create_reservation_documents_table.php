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
        Schema::create('reservation_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_application_id')->constrained()->cascadeOnDelete();
            $table->string('document_type', 30);
            $table->string('title');
            $table->string('disk', 30)->default('local');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size');
            $table->string('status', 30)->default('uploaded');
            $table->timestamp('uploaded_at');
            $table->timestamps();

            $table->index(['reservation_application_id', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_documents');
    }
};
