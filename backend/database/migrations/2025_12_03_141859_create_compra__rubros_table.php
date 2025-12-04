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
            $table->foreignId('rubro_id')->constrained()->onDelete('restrict');
            $table->foreignId('pedido_compra_id')->constrained()->onDelete('restrict');
            $table->foreignId('proveedor_id')->constrained()->onDelete('restrict');
            $table->string('path_material')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compra__rubros');
    }
};
