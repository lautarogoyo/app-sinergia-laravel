<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Evita error si deleted_at ya existe
        if (!Schema::hasColumn('empleados', 'deleted_at')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->softDeletes(); // agrega deleted_at nullable
            });
        }
    }

    public function down(): void
    {
        // Solo eliminar si existe
        if (Schema::hasColumn('empleados', 'deleted_at')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->dropSoftDeletes(); // quita deleted_at
            });
        }
    }

};
