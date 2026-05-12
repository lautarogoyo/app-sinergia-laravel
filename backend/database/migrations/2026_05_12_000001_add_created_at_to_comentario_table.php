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
        if (!Schema::hasColumn('Comentario', 'created_at')) {
            Schema::table('Comentario', function (Blueprint $table) {
                $table->timestamp('created_at')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('Comentario', 'created_at')) {
            Schema::table('Comentario', function (Blueprint $table) {
                $table->dropColumn('created_at');
            });
        }
    }
};
