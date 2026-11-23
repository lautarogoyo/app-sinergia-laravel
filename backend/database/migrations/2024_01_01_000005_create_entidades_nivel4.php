<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * NIVEL 4 — Entidades que dependen de Nivel 3
 *
 * Tablas:
 *   Factura_Impuestos
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Factura_Impuestos ─────────────────────────────────────────────────
        // Detalle impositivo de una factura (relación 1 a 1 con Factura).
        Schema::create('Factura_Impuestos', function (Blueprint $table) {
            // PK = FK a Factura: el valor se copia de Factura.factura_id, no se autogenera.
            $table->unsignedInteger('factura_id')->primary();

            // Neto gravado
            $table->decimal('neto_gral', 12, 2)->nullable();
            $table->decimal('neto_dif', 12, 2)->nullable();
            $table->decimal('neto_spub', 12, 2)->nullable();

            // IVA crédito
            $table->decimal('iva_gral_alicuota', 5, 2)->nullable();
            $table->decimal('iva_gral_importe', 12, 2)->nullable();
            $table->decimal('iva_dif_alicuota', 5, 2)->nullable();
            $table->decimal('iva_dif_importe', 12, 2)->nullable();
            $table->decimal('iva_spub_alicuota', 5, 2)->nullable();
            $table->decimal('iva_spub_importe', 12, 2)->nullable();
    
            // No gravados
            $table->decimal('no_gravado_monotrib', 12, 2)->nullable();
            $table->decimal('no_gravado_exento', 12, 2)->nullable();

            // Percepciones
            $table->decimal('perc_iva', 12, 2)->nullable();
            $table->decimal('perc_iibb', 12, 2)->nullable();
            $table->decimal('perc_otras', 12, 2)->nullable();

            // Retenciones
            $table->decimal('ret_iva', 12, 2)->nullable();
            $table->decimal('ret_iibb', 12, 2)->nullable();
            $table->decimal('ret_gcias', 12, 2)->nullable();
            $table->decimal('ret_otras', 12, 2)->nullable();

            // Otros conceptos
            $table->decimal('imp_internos', 12, 2)->nullable();
            $table->decimal('itc', 12, 2)->nullable();
            $table->decimal('varios', 12, 2)->nullable();

            $table->foreign('factura_id')
                  ->references('factura_id')->on('Factura')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Factura_Impuestos');
    }
};
