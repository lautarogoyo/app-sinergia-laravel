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
            $table->foreignId('grupo_id')->constrained('grupos')->cascadeOnDelete();
            $table->foreignId('obra_id')->constrained('obras')->cascadeOnDelete();
            $table -> string('path_archivo')->nullable();
            $table-> date('fecha_cierre_cotizacion')->nullable();
            $table-> enum('estado_cotizacion', ['pasada', 'debe pasar', 'otro']);
            $table-> enum('estado_comparativa', ['pasado', 'hacer planilla', 'no lleva planilla']);

            $table->timestamps();

            $table->unique(['grupo_id', 'obra_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedido_cotizacion', function (Blueprint $table) {
            if (Schema::hasColumn('pedido_cotizacion', 'grupo_id')) {
                $table->dropForeign(['grupo_id']);
            }
            if (Schema::hasColumn('pedido_cotizacion', 'obra_id')) {
                $table->dropForeign(['obra_id']);
            }
        });
        Schema::dropIfExists('pedido_cotizacion');
    }
};
