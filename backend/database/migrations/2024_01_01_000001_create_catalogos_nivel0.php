<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 0 — Tablas de catálogo / lookup
 * No tienen FK hacia ninguna otra tabla.
 * Deben existir antes que cualquier entidad que las referencie.
 *
 * Tablas:
 *   Estado_Obra, Estado_Grupo, Estado_Empleado, Estado_Documentacion,
 *   Estado_Pedido, Estado_Contratista, Estado_Registro,
 *   Estado_Cotizacion, Estado_Comparativa,
 *   Tipo_Documentacion, Tipo_Facturacion, Rubro, Rol_Pedido
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Estado_Obra ──────────────────────────────────────────────────────
        // Valores esperados: ACTIVA / VENCIDA
        Schema::create('Estado_Obra', function (Blueprint $table) {
            $table->unsignedInteger('estado_obra_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Grupo ─────────────────────────────────────────────────────
        // Valores esperados: ACTIVO / INACTIVO
        Schema::create('Estado_Grupo', function (Blueprint $table) {
            $table->unsignedInteger('estado_grupo_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Empleado ──────────────────────────────────────────────────
        // Valores esperados: ACTIVO / ARCHIVADO
        Schema::create('Estado_Empleado', function (Blueprint $table) {
            $table->unsignedInteger('estado_empleado_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Documentacion ─────────────────────────────────────────────
        // Valores esperados: ACTIVA / VENCIDA
        Schema::create('Estado_Documentacion', function (Blueprint $table) {
            $table->unsignedInteger('estado_documentacion_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Pedido ────────────────────────────────────────────────────
        // Valores esperados: PENDIENTE / PEDIDO
        Schema::create('Estado_Pedido', function (Blueprint $table) {
            $table->unsignedInteger('estado_pedido_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Contratista ───────────────────────────────────────────────
        // Valores esperados: PENDIENTE / APTO / ACTIVO
        Schema::create('Estado_Contratista', function (Blueprint $table) {
            $table->unsignedInteger('estado_contratista_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Registro ──────────────────────────────────────────────────
        // Valores esperados: FALTA CARGAR / SOLICITADO / ENTREGADO
        Schema::create('Estado_Registro', function (Blueprint $table) {
            $table->unsignedInteger('estado_registro_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Cotizacion ────────────────────────────────────────────────
        // Valores esperados: PEDIDA PARA COTIZAR / COTIZADA / EN CURSO / FINALIZADA
        Schema::create('Estado_Cotizacion', function (Blueprint $table) {
            $table->unsignedInteger('estado_cotizacion_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Estado_Comparativa ───────────────────────────────────────────────
        // Valores esperados: PASADO / HACER PLANILLA / NO LLEVA PLANILLA
        Schema::create('Estado_Comparativa', function (Blueprint $table) {
            $table->unsignedInteger('estado_comparativa_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Tipo_Documentacion ───────────────────────────────────────────────
        Schema::create('Tipo_Documentacion', function (Blueprint $table) {
            $table->unsignedInteger('tipo_documentacion_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Tipo_Facturacion ─────────────────────────────────────────────────
        // Valores esperados: MONOTRIBUTISTA / RESPONSABLE INSCRIPTO
        Schema::create('Tipo_Facturacion', function (Blueprint $table) {
            $table->unsignedInteger('tipo_facturacion_id')->autoIncrement();
            $table->string('descripcion', 100);
        });

        // ── Rubro ────────────────────────────────────────────────────────────
        Schema::create('Rubro', function (Blueprint $table) {
            $table->unsignedInteger('rubro_id')->autoIncrement();
            $table->string('descripcion', 150);
        });

        // ── Rol_Pedido ───────────────────────────────────────────────────────
        // Valores esperados: PASADA / DEBE PASAR / OTRO
        Schema::create('Rol_Pedido', function (Blueprint $table) {
            $table->unsignedInteger('rol_id')->autoIncrement();
            $table->string('descripcion', 100);
        });
    }

    public function down(): void
    {
        // Eliminar en orden inverso para evitar conflictos de FK en el futuro
        Schema::dropIfExists('Rol_Pedido');
        Schema::dropIfExists('Rubro');
        Schema::dropIfExists('Tipo_Facturacion');
        Schema::dropIfExists('Tipo_Documentacion');
        Schema::dropIfExists('Estado_Comparativa');
        Schema::dropIfExists('Estado_Cotizacion');
        Schema::dropIfExists('Estado_Registro');
        Schema::dropIfExists('Estado_Contratista');
        Schema::dropIfExists('Estado_Pedido');
        Schema::dropIfExists('Estado_Documentacion');
        Schema::dropIfExists('Estado_Empleado');
        Schema::dropIfExists('Estado_Grupo');
        Schema::dropIfExists('Estado_Obra');
    }
};
