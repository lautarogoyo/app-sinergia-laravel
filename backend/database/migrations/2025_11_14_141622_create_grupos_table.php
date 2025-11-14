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
        // Defensive: only create the table if it doesn't already exist. This migration
        // was generated as a duplicate in the repo; making it idempotent avoids
        // "table already exists" errors during `migrate:fresh` when another
        // migration already created `grupos`.
        if (!Schema::hasTable('grupos')) {
            Schema::create('grupos', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('grupos')) {
            Schema::dropIfExists('grupos');
        }
    }
};
