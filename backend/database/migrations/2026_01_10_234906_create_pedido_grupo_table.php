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
        Schema::create('pedido_grupo', function (Blueprint $table) {
            $table->id();
    $table->foreignId('pedido_id')
        ->constrained('pedidos_cotizacion')
        ->cascadeOnDelete();

    $table->foreignId('grupo_id')
        ->constrained('grupos')
        ->cascadeOnDelete();

    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_grupo');
    }
};
