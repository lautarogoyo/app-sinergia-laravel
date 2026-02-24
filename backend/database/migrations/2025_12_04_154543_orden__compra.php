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
        Schema::create('ordenes_compra', function (Blueprint $table) {
            $table->id();
            $table->string('detalle')->nullable();
            $table->date('fecha_inicio_orden_compra')->nullable();
            $table->date('fecha_fin_orden_compra')->nullable();
            $table->unsignedBigInteger('obra_id');
            $table->timestamps();
        });

        if (Schema::hasTable('obras')) {
            Schema::table('ordenes_compra', function (Blueprint $table) {
                $table->foreign('obra_id')->references('id')->on('obras')->onUpdate('cascade')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordenes_compra');
    }
};
