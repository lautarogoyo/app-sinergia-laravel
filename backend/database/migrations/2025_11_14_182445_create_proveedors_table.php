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
        // Create proveedores table (note: model expects table name `proveedores`)
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('telefono');
            $table->string('email')->nullable();
            $table->enum('monotributista', ['si', 'no'])->default('no');
            $table->string('direccion')->nullable();
            $table->text('comentario')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->cascadeOnUpdate()->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
