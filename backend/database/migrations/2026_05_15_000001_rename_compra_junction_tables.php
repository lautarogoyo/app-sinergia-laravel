<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Renombra las tablas junction de Compra_Rubro eliminando el rubro_id
 * como parte de la PK. Las nuevas tablas vinculan directamente
 * el pedido de compra con proveedor/grupo sin repetir el rubro.
 *
 * Compra_Rubro_Proveedor → Compra_Proveedor
 * Compra_Rubro_Grupo     → Compra_Grupo
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('Compra_Rubro_Proveedor', 'Compra_Proveedor');
        Schema::rename('Compra_Rubro_Grupo', 'Compra_Grupo');

        // Modificar estructura de Compra_Proveedor
        Schema::table('Compra_Proveedor', function (Blueprint $table) {
            $table->dropForeign('fk_crp_compra_rubro');
            $table->dropColumn('rubro_id');
            $table->dropPrimary();
            $table->primary(['nro_obra', 'pedido_compra_id', 'proveedor_id']);
        });

        // Modificar estructura de Compra_Grupo
        Schema::table('Compra_Grupo', function (Blueprint $table) {
            $table->dropForeign('fk_crg_compra_rubro');
            $table->dropColumn('rubro_id');
            $table->dropPrimary();
            $table->primary(['nro_obra', 'pedido_compra_id', 'grupo_id']);
        });
    }

    public function down(): void
    {
        Schema::rename('Compra_Proveedor', 'Compra_Rubro_Proveedor');
        Schema::rename('Compra_Grupo', 'Compra_Rubro_Grupo');
    }
};
