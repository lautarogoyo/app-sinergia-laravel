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
            $table->unsignedBigInteger('empleado_id')->nullable();
            $table->unsignedBigInteger('tipo_documento_id')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('empleados')) {
            Schema::table('documentaciones', function (Blueprint $table) {
                $table->foreign('empleado_id')->references('id')->on('empleados')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('tipos_documento')) {
            Schema::table('documentaciones', function (Blueprint $table) {
                $table->foreign('tipo_documento_id')->references('id')->on('tipos_documento')->onUpdate('cascade')->onDelete('restrict');
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
