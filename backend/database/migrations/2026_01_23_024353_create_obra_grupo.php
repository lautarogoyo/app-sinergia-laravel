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
        Schema::create('obra_grupo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obra_id')
                ->constrained('obras')
                ->restrictOnDelete();
            $table->foreignId('grupo_id')
                ->constrained('grupos')
                ->restrictOnDelete();
            $table->unique(['obra_id', 'grupo_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obra_grupo');
    }
};
