<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            $table->string('path_presupuesto')->nullable()->change();
            $table->string('path_material')->nullable()->change();
            $table->date('fecha_entrega_estimada')->nullable()->change();
            $table->string('estado_contratista')->nullable()->change();
            $table->string('estado_pedido')->nullable()->change();
            $table->string('estado')->nullable()->change();
            $table->text('observaciones')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            $table->string('path_presupuesto')->nullable(false)->change();
            $table->string('path_material')->nullable(false)->change();
            $table->date('fecha_entrega_estimada')->nullable(false)->change();
            $table->string('estado_contratista')->nullable(false)->change();
            $table->string('estado_pedido')->nullable(false)->change();
            $table->string('estado')->nullable(false)->change();
            $table->text('observaciones')->nullable(false)->change();
        });
    }
};
