<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 3 — Entidades que dependen de Nivel 2
 * Referencian Empleado, Pedido_Compra, Orden_Compra, y entidades L1/L0.
 *
 * Tablas:
 *   Documentacion, Factura, Gasto, Compra_Rubro
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Documentacion ─────────────────────────────────────────────────────
        // Documentos adjuntos a un empleado (PK compuesta).
        // Referencia Empleado (L2), Tipo_Documentacion y Estado_Documentacion (L0).
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
        // Factura de compra asociada a una obra. Puede vincularse a una orden de
        // compra (OC), un proveedor O un grupo (contratista) — no ambos a la vez.
        //
        // tipo_factura  : enum A / C
        // empresa       : GOYOAGA / PROTECDUR / SINERGIA
        // forma_pago    : TRANSFERENCIA / ECHEQ
        // cantidad_dias y email se habilitan solo si forma_pago = ECHEQ
        Schema::create('Factura', function (Blueprint $table) {
            $table->string('nro_factura', 50)->primary();
            $table->string('nro_obra', 50);
            $table->string('nro_oc', 50)->nullable();          // FK a Orden_Compra.nro_oc
            $table->unsignedInteger('proveedor_id')->nullable();
            $table->unsignedInteger('grupo_id')->nullable();
            $table->date('fecha');
            $table->enum('tipo_factura', ['A', 'C']);
            $table->enum('empresa', ['GOYOAGA', 'PROTECDUR', 'SINERGIA']);
            $table->enum('forma_pago', ['TRANSFERENCIA', 'ECHEQ']);
            $table->unsignedInteger('cantidad_dias')->nullable(); // Solo si ECHEQ
            $table->string('email', 150)->nullable();             // Solo si ECHEQ
            $table->decimal('importe_total', 15, 2);

            // FK Obra
            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');

            // FK Orden_Compra (referencia solo nro_oc; nro_obra ya está en esta tabla)
            // Se usa nro_oc + nro_obra para apuntar a la PK compuesta de Orden_Compra
            $table->foreign(['nro_oc', 'nro_obra'], 'fk_factura_orden_compra')
                  ->references(['nro_oc', 'nro_obra'])->on('Orden_Compra');

            // FK Proveedor (nullable — la factura puede ser de proveedor o grupo)
            $table->foreign('proveedor_id')
                  ->references('proveedor_id')->on('Proveedor');

            // FK Grupo (nullable — la factura puede ser de proveedor o grupo)
            $table->foreign('grupo_id')
                  ->references('grupo_id')->on('Grupo');
        });

        // ── Gasto ─────────────────────────────────────────────────────────────
        // Gasto real vs proyección de una obra.
        // importe_real se deriva de la suma de facturas de la obra (regla de negocio).
        Schema::create('Gasto', function (Blueprint $table) {
            $table->unsignedInteger('gasto_id')->autoIncrement();
            $table->string('nro_obra', 50);
            $table->decimal('importe_real', 15, 2);
            $table->decimal('importe_proyeccion', 15, 2);

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
        });

        // ── Compra_Rubro ───────────────────────────────────────────────────────
        // Rubros incluidos en un pedido de compra (PK triple).
        // Referencia Pedido_Compra (L2), Obra (L1), Rubro (L0).
        Schema::create('Compra_Rubro', function (Blueprint $table) {
            $table->string('nro_obra', 50);
            $table->unsignedInteger('pedido_compra_id');
            $table->unsignedInteger('rubro_id');

            $table->primary(['nro_obra', 'pedido_compra_id', 'rubro_id']);

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
            $table->foreign('pedido_compra_id')
                  ->references('pedido_compra_id')->on('Pedido_Compra');
            $table->foreign('rubro_id')
                  ->references('rubro_id')->on('Rubro');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Compra_Rubro');
        Schema::dropIfExists('Gasto');
        Schema::dropIfExists('Factura');
        Schema::dropIfExists('Documentacion');
    }
};
