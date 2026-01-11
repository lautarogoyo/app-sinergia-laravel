<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedidos_cotizacion', function (Blueprint $table) {
            $table->id();
            $table->string('path') ->nullable();
            $table->date('fecha_cierre_cotizacion');
            $table->enum('estado_cotizacion', ['pasada', 'debePasar', 'otro'])->nullable();
            $table->enum('estado_comparativa', ['pasado', 'hacerPlanilla', 'noLleva'])->nullable();
            $table->unsignedBigInteger('obra_id');
            $table->timestamps();
        });

        if (Schema::hasTable('obras')) {
            Schema::table('pedidos_cotizacion', function (Blueprint $table) {
                $table->foreign('obra_id')->references('id')->on('obras')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_cotizacion');
    }
};
