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
        Schema::create('pedidos_compra', function (Blueprint $table) {
            $table->id();
            $table->string('rol');
            $table->string('path_presupuesto');
            $table->string('path_material');
            $table->date('fecha_pedido');
            $table->date('fecha_entrega_estimada');
            $table->string('estado_contratista');
            $table->string('estado_pedido');
            $table->string('estado');
            $table->text('observaciones');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_compra');
    }
};
