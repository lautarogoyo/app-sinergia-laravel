<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 4 — Junction tables de Compra_Rubro
 * Son extensiones de la tabla Compra_Rubro, agregando una FK adicional
 * (proveedor o grupo) a la PK triple existente.
 *
 * Tablas:
 *   Compra_Rubro_Proveedor
 *   Compra_Rubro_Grupo
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Compra_Rubro_Proveedor ────────────────────────────────────────────
        // Asigna un proveedor a un rubro dentro de un pedido de compra.
        // Extiende la PK de Compra_Rubro añadiendo proveedor_id.
        Schema::create('Compra_Rubro_Proveedor', function (Blueprint $table) {
            $table->string('nro_obra', 50);
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');
            $table->unsignedInteger('proveedor_id');

            $table->primary(['nro_obra', 'pedido_compra_id', 'rubro_id', 'proveedor_id']);

            // FK hacia la triple PK de Compra_Rubro
            $table->foreign(['nro_obra', 'pedido_compra_id', 'rubro_id'])
                  ->references(['nro_obra', 'pedido_compra_id', 'rubro_id'])
                  ->on('Compra_Rubro');

            $table->foreign('proveedor_id')
                  ->references('proveedor_id')->on('Proveedor');
        });

        // ── Compra_Rubro_Grupo ────────────────────────────────────────────────
        // Asigna un grupo (contratista) a un rubro dentro de un pedido de compra.
        // Extiende la PK de Compra_Rubro añadiendo grupo_id.
        Schema::create('Compra_Rubro_Grupo', function (Blueprint $table) {
            $table->string('nro_obra', 50);
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');
            $table->unsignedInteger('grupo_id');

            $table->primary(['nro_obra', 'pedido_compra_id', 'rubro_id', 'grupo_id']);

            // FK hacia la triple PK de Compra_Rubro
            $table->foreign(['nro_obra', 'pedido_compra_id', 'rubro_id'])
                  ->references(['nro_obra', 'pedido_compra_id', 'rubro_id'])
                  ->on('Compra_Rubro');

            $table->foreign('grupo_id')
                  ->references('grupo_id')->on('Grupo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Compra_Rubro_Grupo');
        Schema::dropIfExists('Compra_Rubro_Proveedor');
    }
};
