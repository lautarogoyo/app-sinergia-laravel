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
        Schema::create('pedidos_cotizacion', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->date('fecha_cierre_cotizacion');
            $table->enum('estado_cotizacion', ['pasada', 'debe_pasar', 'otro']);
            $table->enum('estado_comparativa', ['pasado', 'hacer_planilla', 'no_lleva']);
            $table->unsignedBigInteger('obra_id');
            $table  ->foreign('obra_id')
                    ->references('id')
                    ->on('obras')
                    ->onUpdate('cascade')
                    ->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_cotizacion');
    }
};
