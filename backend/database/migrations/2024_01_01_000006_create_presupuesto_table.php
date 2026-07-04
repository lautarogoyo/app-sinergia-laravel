<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Presupuesto — archivos de presupuesto adjuntos a un Pedido_Compra.
 * Referencia Pedido_Compra (L2) y Obra (L1).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Presupuesto', function (Blueprint $table) {
            $table->unsignedInteger('presupuesto_id')->autoIncrement();
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('obra_id');
            $table->string('path_archivo');
            $table->string('nombre_archivo')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('pedido_compra_id')
                  ->references('pedido_compra_id')->on('Pedido_Compra');
            $table->foreign('obra_id')
                  ->references('obra_id')->on('Obra');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Presupuesto');
    }
};
