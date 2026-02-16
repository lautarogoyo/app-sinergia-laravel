<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_cotizacion', function (Blueprint $table) {
            $table->string('path_archivo_cotizacion')->nullable()->change();
            $table->string('path_archivo_mano_obra')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pedidos_cotizacion', function (Blueprint $table) {
            $table->string('path_archivo_cotizacion')->nullable(false)->change();
            $table->string('path_archivo_mano_obra')->nullable(false)->change();
        });
    }
};
