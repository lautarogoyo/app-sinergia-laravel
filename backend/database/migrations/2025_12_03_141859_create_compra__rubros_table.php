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
        Schema::create('compra_rubro', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rubro_id')->nullable();
            $table->unsignedBigInteger('pedido_compra_id')->nullable();
            $table->unsignedBigInteger('proveedor_id')->nullable();
            $table->string('path_material')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('rubros')) {
            Schema::table('compra_rubro', function (Blueprint $table) {
                $table->foreign('rubro_id')->references('id')->on('rubros')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('pedido_compra')) {
            Schema::table('compra_rubro', function (Blueprint $table) {
                $table->foreign('pedido_compra_id')->references('id')->on('pedido_compra')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('proveedores')) {
            Schema::table('compra_rubro', function (Blueprint $table) {
                $table->foreign('proveedor_id')->references('id')->on('proveedores')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compra_rubro');
    }
};
