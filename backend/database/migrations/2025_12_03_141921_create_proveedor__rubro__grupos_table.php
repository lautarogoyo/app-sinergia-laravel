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
        Schema::create('rubro_proveedor', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proveedor_id');
            $table->unsignedBigInteger('rubro_id');
            $table->timestamps();

            // Evita duplicados
            $table->unique(['proveedor_id', 'rubro_id']);
        });

        if (Schema::hasTable('proveedores')) {
            Schema::table('rubro_proveedor', function (Blueprint $table) {
                $table->foreign('proveedor_id')->references('id')->on('proveedores')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('rubros')) {
            Schema::table('rubro_proveedor', function (Blueprint $table) {
                $table->foreign('rubro_id')->references('id')->on('rubros')->onUpdate('cascade')->onDelete('restrict');
            });
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubro_proveedor');
    }
};
