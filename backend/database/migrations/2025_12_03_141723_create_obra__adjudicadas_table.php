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
        if (!Schema::hasTable('obras_adjudicadas')) {
            Schema::create('obras_adjudicadas', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('id_pedido_cotizacion')->nullable();
                $table->unsignedBigInteger('id_pedido_compra')->nullable();
                $table->timestamps();
            });

            if (Schema::hasTable('pedido_cotizacion')) {
                Schema::table('obras_adjudicadas', function (Blueprint $table) {
                    $table->foreign('id_pedido_cotizacion')
                        ->references('id')
                        ->on('pedido_cotizacion')
                        ->onUpdate('cascade')
                        ->onDelete('restrict');
                });
            }

            if (Schema::hasTable('pedido_compra')) {
                Schema::table('obras_adjudicadas', function (Blueprint $table) {
                    $table->foreign('id_pedido_compra')
                        ->references('id')
                        ->on('pedido_compra')
                        ->onUpdate('cascade')
                        ->onDelete('restrict');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obras_adjudicadas');
    }
};
