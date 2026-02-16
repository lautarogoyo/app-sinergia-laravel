<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            $table->unsignedBigInteger('obra_id')->nullable()->after('observaciones');
            $table->foreign('obra_id')
                  ->references('id')
                  ->on('obras')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('pedidos_compra', function (Blueprint $table) {
            $table->dropForeign(['obra_id']);
            $table->dropColumn('obra_id');
        });
    }
};
