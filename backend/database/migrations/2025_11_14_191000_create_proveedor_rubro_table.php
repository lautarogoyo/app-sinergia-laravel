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
        Schema::create('proveedor_rubro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proveedor_id')->constrained('proveedores')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('rubro_id')->constrained('rubros')->cascadeOnUpdate()->restrictOnDelete();
            $table ->string('descripcion')->nullable();
            $table->timestamps();

            // evita duplicados
            $table->unique(['proveedor_id', 'rubro_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('proveedor_rubro')) {
            Schema::table('proveedor_rubro', function (Blueprint $table) {
                if (Schema::hasColumn('proveedor_rubro', 'proveedor_id')) {
                    $table->dropForeign(['proveedor_id']);
                }
                if (Schema::hasColumn('proveedor_rubro', 'rubro_id')) {
                    $table->dropForeign(['rubro_id']);
                }
            });
            Schema::dropIfExists('proveedor_rubro');
        }
    }
};
