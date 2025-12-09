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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->boolean('monotributista')->default(false);
            $table->string('direccion')->nullable();
            $table->text('comentario')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('usuarios')) {
            Schema::table('proveedores', function (Blueprint $table) {
                $table->foreign('id_usuario')->references('id')->on('usuarios')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
