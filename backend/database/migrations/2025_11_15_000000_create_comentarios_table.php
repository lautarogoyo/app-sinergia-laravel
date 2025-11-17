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
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obra_id')->constrained('obras')->cascadeOnUpdate()->restrictOnDelete();
            $table->text('denominacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('comentarios')) {
            Schema::table('comentarios', function (Blueprint $table) {
                if (Schema::hasColumn('comentarios', 'obra_id')) {
                    $table->dropForeign(['obra_id']);
                }
            });
            Schema::dropIfExists('comentarios');
        }
    }
};
