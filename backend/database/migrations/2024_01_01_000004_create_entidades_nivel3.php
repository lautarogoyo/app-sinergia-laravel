<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 3 — Entidades que dependen de Nivel 2
 * Referencian Empleado, Pedido_Compra, Orden_Compra y entidades L1/L0.
 *
 * Tablas:
 *   Documentacion, Factura, Gasto, Presupuesto,
 *   Compra_Rubro, Compra_Proveedor, Compra_Grupo
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Documentacion ─────────────────────────────────────────────────────
        // Documentos adjuntos a un empleado (PK compuesta).
        Schema::create('Documentacion', function (Blueprint $table) {
            $table->unsignedInteger('empleado_id');
            $table->unsignedInteger('documentacion_id');
            $table->string('path');
            $table->date('fecha_vencimiento');
            $table->unsignedInteger('tipo_documentacion_id');
            $table->unsignedInteger('estado_documentacion_id');

            $table->primary(['empleado_id', 'documentacion_id']);

            $table->foreign('empleado_id')
                  ->references('empleado_id')->on('Empleado');
            $table->foreign('tipo_documentacion_id')
                  ->references('tipo_documentacion_id')->on('Tipo_Documentacion');
            $table->foreign('estado_documentacion_id')
                  ->references('estado_documentacion_id')->on('Estado_Documentacion');
        });

        // ── Factura ───────────────────────────────────────────────────────────
        // Factura asociada a una obra. Puede vincularse a una orden de compra,
        // y a un proveedor O un grupo (contratista) — no ambos a la vez.
        //
        // cantidad_dias y email se usan solo si forma_pago = ECHEQ.
        Schema::create('Factura', function (Blueprint $table) {
            $table->string('nro_factura', 50)->primary();
            $table->unsignedInteger('obra_id');
            $table->string('nro_oc', 50)->nullable();
            $table->unsignedInteger('proveedor_id')->nullable();
            $table->unsignedInteger('grupo_id')->nullable();
            $table->date('fecha');
            $table->enum('tipo_factura', ['A', 'C']);
            $table->enum('empresa', ['GOYOAGA', 'PROTECDUR', 'SINERGIA']);
            $table->enum('forma_pago', ['TRANSFERENCIA', 'ECHEQ']);
            $table->unsignedInteger('cantidad_dias')->nullable();
            $table->string('email', 150)->nullable();
            $table->decimal('importe_total', 15, 2);

            $table->foreign('obra_id')
                  ->references('obra_id')->on('Obra');
            // Apunta a la PK compuesta (nro_oc, obra_id) de Orden_Compra
            $table->foreign(['nro_oc', 'obra_id'], 'fk_factura_orden_compra')
                  ->references(['nro_oc', 'obra_id'])->on('Orden_Compra');
            $table->foreign('proveedor_id')
                  ->references('proveedor_id')->on('Proveedor');
            $table->foreign('grupo_id')
                  ->references('grupo_id')->on('Grupo');
        });

        // ── Gasto ─────────────────────────────────────────────────────────────
        // Gasto real vs proyección de una obra.
        // importe_real se deriva de la suma de facturas de la obra (regla de negocio).
        Schema::create('Gasto', function (Blueprint $table) {
            $table->unsignedInteger('gasto_id')->autoIncrement();
            $table->unsignedInteger('obra_id');
            $table->decimal('importe_real', 15, 2);
            $table->decimal('importe_proyeccion', 15, 2);

            $table->foreign('obra_id')
                  ->references('obra_id')->on('Obra');
        });

        // ── Presupuesto ───────────────────────────────────────────────────────
        // Archivos de presupuesto adjuntos a un Pedido_Compra.
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

        // ── Compra_Rubro ──────────────────────────────────────────────────────
        // Rubros incluidos en un pedido de compra.
        Schema::create('Compra_Rubro', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'rubro_id']);

            $table->foreign('obra_id')
                  ->references('obra_id')->on('Obra');
            $table->foreign('pedido_compra_id')
                  ->references('pedido_compra_id')->on('Pedido_Compra');
            $table->foreign('rubro_id')
                  ->references('rubro_id')->on('Rubro');
        });

        // ── Compra_Proveedor ──────────────────────────────────────────────────
        // Proveedores asignados a un pedido de compra.
        Schema::create('Compra_Proveedor', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('proveedor_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'proveedor_id']);

            $table->foreign('obra_id', 'fk_cp_obra')
                  ->references('obra_id')->on('Obra');
            $table->foreign('pedido_compra_id', 'fk_cp_pedido_compra')
                  ->references('pedido_compra_id')->on('Pedido_Compra');
            $table->foreign('proveedor_id', 'fk_cp_proveedor')
                  ->references('proveedor_id')->on('Proveedor');
        });

        // ── Compra_Grupo ──────────────────────────────────────────────────────
        // Grupos (contratistas) asignados a un pedido de compra.
        Schema::create('Compra_Grupo', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('grupo_id');

            $table->primary(['obra_id', 'pedido_compra_id', 'grupo_id']);

            $table->foreign('obra_id', 'fk_cg_obra')
                  ->references('obra_id')->on('Obra');
            $table->foreign('pedido_compra_id', 'fk_cg_pedido_compra')
                  ->references('pedido_compra_id')->on('Pedido_Compra');
            $table->foreign('grupo_id', 'fk_cg_grupo')
                  ->references('grupo_id')->on('Grupo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Compra_Grupo');
        Schema::dropIfExists('Compra_Proveedor');
        Schema::dropIfExists('Compra_Rubro');
        Schema::dropIfExists('Presupuesto');
        Schema::dropIfExists('Gasto');
        Schema::dropIfExists('Factura');
        Schema::dropIfExists('Documentacion');
    }
};
