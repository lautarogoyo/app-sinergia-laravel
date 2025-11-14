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
        Schema::create('obras', function (Blueprint $table) {
            $table->id();
            $table->string('nro_obra')->nullable();
            $table->text('detalle')->nullable();
            $table->string('estado')->nullable();
            $table->date('fecha_visto')->nullable();
            $table->string('direccion')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_programacion_inicio')->nullable();
            $table->date('fecha_recepcion_provisoria')->nullable();
            $table->date('fecha_recepcion_definitiva')->nullable();
            $table->text('detalle_caratula')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obras');
    }
};
