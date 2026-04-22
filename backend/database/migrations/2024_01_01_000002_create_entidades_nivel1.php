<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 1 — Entidades principales
 * Solo tienen FK hacia tablas de Nivel 0 (catálogos) y Usuario.
 *
 * Tablas:
 *   Usuario, Obra, Grupo, Proveedor
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Usuario ──────────────────────────────────────────────────────────
        // Sin FK externas. Base para Grupo, Proveedor y auth futura.
        Schema::create('Usuario', function (Blueprint $table) {
            $table->unsignedInteger('usuario_id')->autoIncrement();
            $table->string('nombre_usuario', 100)->unique();
            $table->string('email', 150)->unique();
            $table->string('contrasenia');
            $table->string('nombre', 100);
            $table->string('apellido', 100);
        });

        // ── Obra ─────────────────────────────────────────────────────────────
        // Entidad central del sistema. Solo referencia Estado_Obra (L0).
        Schema::create('Obra', function (Blueprint $table) {
            $table->string('nro_obra', 50)->primary();
            $table->unsignedInteger('estado_obra_id');
            $table->string('detalle');
            $table->date('fecha_visto');
            $table->date('fecha_ingreso');
            $table->date('fecha_programacion_inicio')->nullable();
            $table->date('fecha_recepcion_provisoria')->nullable();
            $table->date('fecha_recepcion_definitiva')->nullable();
            $table->date('fecha_inicio_orden_compra')->nullable();
            $table->date('fecha_finalizacion_orden_compra')->nullable();
            $table->string('detalle_caratula')->nullable();

            $table->foreign('estado_obra_id')
                  ->references('estado_obra_id')->on('Estado_Obra');
        });

        // ── Grupo ─────────────────────────────────────────────────────────────
        // Contratista / grupo de trabajo. Referencia Usuario, Tipo_Facturacion,
        // Estado_Grupo (todos L0/L1).
        Schema::create('Grupo', function (Blueprint $table) {
            $table->unsignedInteger('grupo_id')->autoIncrement();
            $table->unsignedInteger('usuario_id');
            $table->string('nombre_apellido', 200);
            $table->string('telefono', 50)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('ciudad', 100)->nullable();
            $table->string('calificacion', 50)->nullable();
            $table->string('contacto', 150)->nullable();
            $table->string('observacion')->nullable();
            $table->date('fecha_ingreso')->default(DB::raw('(CURDATE())'));
            $table->unsignedInteger('tipo_facturacion_id');
            $table->unsignedInteger('estado_grupo_id');

            $table->foreign('usuario_id')
                  ->references('usuario_id')->on('Usuario');
            $table->foreign('tipo_facturacion_id')
                  ->references('tipo_facturacion_id')->on('Tipo_Facturacion');
            $table->foreign('estado_grupo_id')
                  ->references('estado_grupo_id')->on('Estado_Grupo');
        });

        // ── Proveedor ─────────────────────────────────────────────────────────
        // Proveedor de materiales/servicios. Misma estructura base que Grupo
        // pero sin estado_grupo (los proveedores no tienen ciclo de estado propio).
        Schema::create('Proveedor', function (Blueprint $table) {
            $table->unsignedInteger('proveedor_id')->autoIncrement();
            $table->unsignedInteger('usuario_id');
            $table->string('nombre_apellido', 200);
            $table->string('telefono', 50)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('direccion', 255)->nullable();
            $table->string('ciudad', 100)->nullable();
            $table->string('calificacion', 50)->nullable();
            $table->string('contacto', 150)->nullable();
            $table->string('observacion')->nullable();
            $table->date('fecha_ingreso')->default(DB::raw('(CURDATE())'));
            $table->unsignedInteger('tipo_facturacion_id');

            $table->foreign('usuario_id')
                  ->references('usuario_id')->on('Usuario');
            $table->foreign('tipo_facturacion_id')
                  ->references('tipo_facturacion_id')->on('Tipo_Facturacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Proveedor');
        Schema::dropIfExists('Grupo');
        Schema::dropIfExists('Obra');
        Schema::dropIfExists('Usuario');
    }
};
