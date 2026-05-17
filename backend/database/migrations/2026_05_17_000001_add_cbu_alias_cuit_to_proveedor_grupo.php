<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Proveedor', function (Blueprint $table) {
            $table->string('cuit', 13)->nullable()->after('nombre_apellido');
            $table->string('cbu', 22)->nullable()->after('cuit');
            $table->string('alias', 100)->nullable()->after('cbu');
        });

        Schema::table('Grupo', function (Blueprint $table) {
            $table->string('cbu', 22)->nullable()->after('nombre_apellido');
            $table->string('alias', 100)->nullable()->after('cbu');
        });
    }

    public function down(): void
    {
        Schema::table('Proveedor', function (Blueprint $table) {
            $table->dropColumn(['cuit', 'cbu', 'alias']);
        });

        Schema::table('Grupo', function (Blueprint $table) {
            $table->dropColumn(['cbu', 'alias']);
        });
    }
};