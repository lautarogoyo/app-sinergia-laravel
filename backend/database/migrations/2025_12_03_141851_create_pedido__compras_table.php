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
        Schema::create('pedido_compra', function (Blueprint $table) {
            $table->id();
            $table->string('rol')->nullable();
            $table->string('path_presupuesto')->nullable();
            $table->date('fecha_pedido')->nullable();
            $table->date('fecha_entrega_estimada')->nullable();
            $table->string('estado_contratista')->nullable();
            $table->string('estado_pedido')->nullable();
            $table->string('estado')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_compra');
    }
};
