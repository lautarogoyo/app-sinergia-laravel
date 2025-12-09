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
        if (!Schema::hasTable('proveedor_rubro_grupo')) {
            Schema::create('proveedor_rubro_grupo', function (Blueprint $table) {
                $table->id();
                $table->text('descripcion')->nullable();
                $table->unsignedBigInteger('id_rubro');
                $table->unsignedBigInteger('id_proveedor');
                $table->unsignedBigInteger('id_grupo')->nullable();
                $table->timestamps();
            });

            if (Schema::hasTable('rubros')) {
                Schema::table('proveedor_rubro_grupo', function (Blueprint $table) {
                    $table->foreign('id_rubro')
                        ->references('id')
                        ->on('rubros')
                        ->onUpdate('cascade')
                        ->onDelete('restrict');
                });
            }

            if (Schema::hasTable('proveedores')) {
                Schema::table('proveedor_rubro_grupo', function (Blueprint $table) {
                    $table->foreign('id_proveedor')
                        ->references('id')
                        ->on('proveedores')
                        ->onUpdate('cascade')
                        ->onDelete('restrict');
                });
            }

            if (Schema::hasTable('grupos')) {
                Schema::table('proveedor_rubro_grupo', function (Blueprint $table) {
                    $table->foreign('id_grupo')
                        ->references('id')
                        ->on('grupos')
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
        Schema::dropIfExists('proveedor_rubro_grupo');
    }
};
