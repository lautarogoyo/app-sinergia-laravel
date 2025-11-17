<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('empleados', 'id_grupo')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->foreignId('id_grupo')->nullable()->constrained('grupos')->cascadeOnUpdate()->restrictOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('empleados', 'id_grupo')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->dropForeign(['id_grupo']);
                $table->dropColumn('id_grupo');
            });
        }
    }
};