<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Grupo', function (Blueprint $table) {
            $table->unique('denominacion', 'grupo_denominacion_unique');
        });
    }

    public function down(): void
    {
        Schema::table('Grupo', function (Blueprint $table) {
            $table->dropUnique('grupo_denominacion_unique');
        });
    }
};
