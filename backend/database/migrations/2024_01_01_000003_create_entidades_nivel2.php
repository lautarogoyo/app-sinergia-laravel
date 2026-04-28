<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 2 — Entidades que dependen de Nivel 1
 * Referencian Obra, Grupo, Proveedor y/o catálogos (L0).
 *
 * Tablas:
 *   Empleado, Comentario, Pedido_Cotizacion, Orden_Compra,
 *   Pedido_Compra, Proveedor_Rubro, Obra_Grupo
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Empleado ─────────────────────────────────────────────────────────
        // Referencia Grupo (L1) y Estado_Empleado (L0).
        Schema::create('Empleado', function (Blueprint $table) {
            $table->unsignedInteger('empleado_id')->autoIncrement();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('telefono', 50);
            $table->string('cbu', 22)->nullable();
            $table->string('alias', 100)->nullable();
            $table->unsignedInteger('grupo_id');
            $table->date('archivado_at')->nullable();
            $table->date('cancelado_at')->nullable();
            $table->unsignedInteger('estado_empleado_id');

            $table->foreign('grupo_id')
                  ->references('grupo_id')->on('Grupo');
            $table->foreign('estado_empleado_id')
                  ->references('estado_empleado_id')->on('Estado_Empleado');
        });

        // ── Comentario ───────────────────────────────────────────────────────
        // Comentarios libres sobre una obra.
        Schema::create('Comentario', function (Blueprint $table) {
            $table->unsignedInteger('comentario_id')->autoIncrement();
            $table->string('nro_obra', 50);
            $table->text('detalle');

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
        });

        // ── Pedido_Cotizacion ─────────────────────────────────────────────────
        // Solicitud de cotización asociada a una obra.
        Schema::create('Pedido_Cotizacion', function (Blueprint $table) {
            $table->unsignedInteger('pedido_cotizacion_id')->autoIncrement();
            $table->string('nro_obra', 50);
            $table->string('path_archivo')->nullable();
            $table->string('path_archivo_mano_obra')->nullable();
            $table->date('fecha_cierre_cotizacion')->nullable();
            $table->unsignedInteger('estado_cotizacion_id');
            $table->unsignedInteger('estado_comparativa_id');

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
            $table->foreign('estado_cotizacion_id')
                  ->references('estado_cotizacion_id')->on('Estado_Cotizacion');
            $table->foreign('estado_comparativa_id')
                  ->references('estado_comparativa_id')->on('Estado_Comparativa');
        });

        // ── Orden_Compra ─────────────────────────────────────────────────────
        // Orden de compra emitida a un grupo para una obra.
        // Restricción de negocio: la suma de facturas no debe superar el importe.
        Schema::create('Orden_Compra', function (Blueprint $table) {
            $table->string('nro_oc', 50);
            $table->string('nro_obra', 50);
            $table->unsignedInteger('grupo_id');
            $table->text('detalle');
            $table->decimal('importe', 15, 2);

            $table->primary(['nro_oc', 'nro_obra']);

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
            $table->foreign('grupo_id')
                  ->references('grupo_id')->on('Grupo');
        });

        // ── Pedido_Compra ─────────────────────────────────────────────────────
        // Pedido de compra de materiales para una obra.
        // Incluye estados: contratista, pedido, registro y rol del pedido.
        Schema::create('Pedido_Compra', function (Blueprint $table) {
            $table->unsignedInteger('pedido_compra_id')->autoIncrement();
            $table->string('nro_obra', 50);
            $table->unsignedInteger('rol_pedido_id');
            $table->string('path_presupuesto')->nullable();
            $table->string('path_material')->nullable();
            $table->date('fecha_pedido');
            $table->date('fecha_entrega_estimada')->nullable();
            $table->unsignedInteger('estado_contratista_id')->nullable();
            $table->unsignedInteger('estado_pedido_id');
            $table->unsignedInteger('estado_registro_id');
            $table->string('observaciones')->nullable();

            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
            $table->foreign('rol_pedido_id')
                  ->references('rol_id')->on('Rol_Pedido');
            $table->foreign('estado_contratista_id')
                  ->references('estado_contratista_id')->on('Estado_Contratista');
            $table->foreign('estado_pedido_id')
                  ->references('estado_pedido_id')->on('Estado_Pedido');
            $table->foreign('estado_registro_id')
                  ->references('estado_registro_id')->on('Estado_Registro');
        });

        // ── Proveedor_Rubro ───────────────────────────────────────────────────
        // Rubros/especialidades que ofrece un proveedor (many-to-many).
        Schema::create('Proveedor_Rubro', function (Blueprint $table) {
            $table->unsignedInteger('proveedor_id');
            $table->unsignedInteger('rubro_id');

            $table->primary(['proveedor_id', 'rubro_id']);

            $table->foreign('proveedor_id')
                  ->references('proveedor_id')->on('Proveedor');
            $table->foreign('rubro_id')
                  ->references('rubro_id')->on('Rubro');
        });

        // ── Obra_Grupo ────────────────────────────────────────────────────────
        // Grupos (contratistas) asignados a una obra (many-to-many).
        Schema::create('Obra_Grupo', function (Blueprint $table) {
            $table->unsignedInteger('id_grupo');
            $table->string('nro_obra', 50);

            $table->primary(['id_grupo', 'nro_obra']);

            $table->foreign('id_grupo')
                  ->references('grupo_id')->on('Grupo');
            $table->foreign('nro_obra')
                  ->references('nro_obra')->on('Obra');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Obra_Grupo');
        Schema::dropIfExists('Proveedor_Rubro');
        Schema::dropIfExists('Pedido_Compra');
        Schema::dropIfExists('Orden_Compra');
        Schema::dropIfExists('Pedido_Cotizacion');
        Schema::dropIfExists('Comentario');
        Schema::dropIfExists('Empleado');
    }
};
