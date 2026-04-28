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
        Schema::table('Proveedor', function (Blueprint $table) {
            $table->unsignedInteger('usuario_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('Proveedor', function (Blueprint $table) {
            $table->unsignedInteger('usuario_id')->nullable(false)->change();
        });
    }
};
