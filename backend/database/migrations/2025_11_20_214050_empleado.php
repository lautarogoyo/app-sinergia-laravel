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
            Schema::create('empleados', function (Blueprint $table) {
                $table->id();
                $table->string('nombre');
                $table->string('apellido');
                $table->string('telefono')->nullable();
                $table->string('cbu')->nullable();
                $table->string('alias')->nullable();
                $table->enum('estado', ['activo', 'inactivo'])->default('activo');
                $table->unsignedBigInteger('id_grupo')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });

            if (Schema::hasTable('grupos')) {
                Schema::table('empleados', function (Blueprint $table) {
                    $table->foreign('id_grupo')->references('id')->on('grupos')->onUpdate('cascade')->onDelete('restrict');
                });
            }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
