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
        Schema::create('rubro_grupo', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rubro_id')
                ->constrained('rubros')
                ->restrictOnDelete();

            $table->foreignId('grupo_id')
                ->constrained('grupos')
                ->restrictOnDelete();

            $table->unique(['rubro_id', 'grupo_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubro_grupo');
    }
};
