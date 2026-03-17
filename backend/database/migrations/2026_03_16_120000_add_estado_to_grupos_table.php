<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('grupos', 'estado')) {
            Schema::table('grupos', function (Blueprint $table) {
                $table->string('estado')->default('pendiente')->after('denominacion');
            });
        }

        DB::table('grupos')
            ->whereNull('estado')
            ->update(['estado' => 'pendiente']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('grupos', 'estado')) {
            Schema::table('grupos', function (Blueprint $table) {
                $table->dropColumn('estado');
            });
        }
    }
};
