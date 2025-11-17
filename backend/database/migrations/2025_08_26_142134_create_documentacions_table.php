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
        Schema::create('documentaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tipo_documento')->constrained('tipo_documentos')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('id_empleado')->constrained('empleados')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('path');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['vigente', 'vencido'])->default('vigente');
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentaciones');
    }
};
