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
        Schema::create('pedido_cotizacion', function (Blueprint $table) {
            $table->id();
            $table->string('path')->nullable();
            $table->date('fecha_cierre_cotizacion')->nullable();
            $table->string('estado_cotizacion')->nullable();
            $table->string('estado_comparativa')->nullable();
            $table->unsignedBigInteger('id_obra')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('obras')) {
            Schema::table('pedido_cotizacion', function (Blueprint $table) {
                $table->foreign('id_obra')->references('id')->on('obras')->onUpdate('cascade')->onDelete('restrict');
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
