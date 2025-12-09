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
            $table->string('path')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('estado')->nullable();
            $table->string('mime')->nullable();
            $table->bigInteger('size')->nullable();
            $table->unsignedBigInteger('id_empleado')->nullable();
            $table->unsignedBigInteger('id_tipoDocumento')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('empleados')) {
            Schema::table('documentaciones', function (Blueprint $table) {
                $table->foreign('id_empleado')->references('id')->on('empleados')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('tipo_documentos')) {
            Schema::table('documentaciones', function (Blueprint $table) {
                $table->foreign('id_tipoDocumento')->references('id')->on('tipo_documentos')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentaciones');
    }
};
