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
        Schema::create('obra_grupo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('obra_id');
            $table->unsignedBigInteger('grupo_id');
            $table->unique(['obra_id', 'grupo_id']);
            $table->timestamps();
        });

        if (Schema::hasTable('obras')) {
            Schema::table('obra_grupo', function (Blueprint $table) {
                $table->foreign('obra_id')->references('id')->on('obras')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('grupos')) {
            Schema::table('obra_grupo', function (Blueprint $table) {
                $table->foreign('grupo_id')->references('id')->on('grupos')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obra_grupo');
    }
};
