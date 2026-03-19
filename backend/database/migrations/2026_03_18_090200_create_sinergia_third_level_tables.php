<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Compra_Rubro', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'rubro_id']);

            $table->foreign(['obra_id', 'pedido_compra_id'])
                ->references(['obra_id', 'pedido_compra_id'])
                ->on('Pedido_Compra')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('rubro_id')
                ->references('rubro_id')
                ->on('Rubro')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Compra_Rubro');
    }
};
