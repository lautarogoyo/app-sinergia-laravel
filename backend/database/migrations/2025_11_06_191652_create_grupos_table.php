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
        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->string('denominacion');
            $table->timestamps();
        });

        // If the empleados table and the id_grupo column already exist, add the foreign key now.
        // This ensures the foreign key is created after grupos exists regardless of migration ordering.
        if (Schema::hasTable('empleados') && Schema::hasColumn('empleados', 'id_grupo')) {
            Schema::table('empleados', function (Blueprint $table) {
                // only add the foreign key if it does not already exist
                $table->foreign('id_grupo')->references('id')->on('grupos')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grupos');
    }
};
