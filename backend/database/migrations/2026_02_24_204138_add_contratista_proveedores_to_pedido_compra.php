<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            $table->unsignedBigInteger('grupo_id')->nullable()->after('obra_id');
            $table->foreign('grupo_id')->references('id')->on('grupos')->nullOnDelete();
            $table->json('proveedores')->nullable()->after('grupo_id');
        });
    }

   public function down(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            if (Schema::hasColumn('pedidos_compra', 'grupo_id')) {
                $table->dropForeign(['grupo_id']);
                $table->dropColumn('grupo_id');
            }
            if (Schema::hasColumn('pedidos_compra', 'proveedores')) {
                $table->dropColumn('proveedores');
            }
        });
    }
};
