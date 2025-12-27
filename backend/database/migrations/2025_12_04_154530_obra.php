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
            $table->string('nro_obra');
            $table->text('detalle');
            $table->enum('estado', ['pedida', 'cotizada', 'enCurso', 'finalizada'])->default('pedida');
            $table->date('fecha_visto');
            $table->string('direccion');
            $table->date('fecha_ingreso');
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
