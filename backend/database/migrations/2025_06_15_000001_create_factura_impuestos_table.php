<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('Factura_Impuestos', function (Blueprint $table) {
            $table->string('nro_factura', 50)->primary();

            // Neto Gravado
            $table->decimal('neto_gral',  12, 2)->nullable();
            $table->decimal('neto_dif',   12, 2)->nullable();
            $table->decimal('neto_spub',  12, 2)->nullable();

            // IVA Crédito
            $table->decimal('iva_gral_alicuota', 5, 2)->nullable();
            $table->decimal('iva_gral_importe',  12, 2)->nullable();
            $table->decimal('iva_dif_alicuota',  5, 2)->nullable();
            $table->decimal('iva_dif_importe',   12, 2)->nullable();
            $table->decimal('iva_spub_alicuota', 5, 2)->nullable();
            $table->decimal('iva_spub_importe',  12, 2)->nullable();

            // No Gravados
            $table->decimal('no_gravado_monotrib', 12, 2)->nullable();
            $table->decimal('no_gravado_exento',   12, 2)->nullable();

            // Percepciones
            $table->decimal('perc_iva',   12, 2)->nullable();
            $table->decimal('perc_iibb',  12, 2)->nullable();
            $table->decimal('perc_otras', 12, 2)->nullable();

            // Retenciones
            $table->decimal('ret_iva',   12, 2)->nullable();
            $table->decimal('ret_iibb',  12, 2)->nullable();
            $table->decimal('ret_gcias', 12, 2)->nullable();
            $table->decimal('ret_otras', 12, 2)->nullable();

            // Otros Conceptos
            $table->decimal('imp_internos', 12, 2)->nullable();
            $table->decimal('itc',          12, 2)->nullable();
            $table->decimal('varios',       12, 2)->nullable();

            $table->foreign('nro_factura')
                  ->references('nro_factura')->on('Factura')
                  ->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('Factura_Impuestos');
    }
};