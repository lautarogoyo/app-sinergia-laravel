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
            $table->string('telefono');
            $table->string('cbu')->nullable();
            $table->string('alias')->nullable();
            $table->enum('estado', ['activo', 'inactivo', 'cancelado'])->default('activo');
            // create the column without adding the foreign key constraint here so migration order
            // won't fail if the `grupos` table doesn't exist yet
            $table->unsignedBigInteger('id_grupo')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
