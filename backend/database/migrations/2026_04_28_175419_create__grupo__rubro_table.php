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
        Schema::create('Grupo_Rubro', function (Blueprint $table) {
            $table->unsignedInteger('grupo_id');
            $table->unsignedInteger('rubro_id');
            $table->primary(['grupo_id', 'rubro_id']);
            $table->foreign('grupo_id')->references('grupo_id')->on('Grupo')->onDelete('cascade');
            $table->foreign('rubro_id')->references('rubro_id')->on('Rubro')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Grupo_Rubro');
    }
};
