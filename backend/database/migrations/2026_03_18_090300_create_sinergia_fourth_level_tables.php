<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Compra_Rubro_Proveedor', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');
            $table->unsignedInteger('proveedor_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'rubro_id', 'proveedor_id']);

            $table->foreign(['obra_id', 'pedido_compra_id', 'rubro_id'])
                ->references(['obra_id', 'pedido_compra_id', 'rubro_id'])
                ->on('Compra_Rubro')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('proveedor_id')
                ->references('proveedor_id')
                ->on('Proveedor')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('Compra_Rubro_Grupo', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');
            $table->unsignedInteger('grupo_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'rubro_id', 'grupo_id']);

            $table->foreign(['obra_id', 'pedido_compra_id', 'rubro_id'])
                ->references(['obra_id', 'pedido_compra_id', 'rubro_id'])
                ->on('Compra_Rubro')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('grupo_id')
                ->references('grupo_id')
                ->on('Grupo')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Compra_Rubro_Grupo');
        Schema::dropIfExists('Compra_Rubro_Proveedor');
    }
};
