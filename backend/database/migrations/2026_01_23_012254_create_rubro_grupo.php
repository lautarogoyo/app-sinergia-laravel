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
        Schema::create('rubro_grupo', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('rubro_id');
            $table->unsignedBigInteger('grupo_id');

            $table->unique(['rubro_id', 'grupo_id']);

            $table->timestamps();
        });

        if (Schema::hasTable('rubros')) {
            Schema::table('rubro_grupo', function (Blueprint $table) {
                $table->foreign('rubro_id')->references('id')->on('rubros')->onUpdate('cascade')->onDelete('restrict');
            });
        }

        if (Schema::hasTable('grupos')) {
            Schema::table('rubro_grupo', function (Blueprint $table) {
                $table->foreign('grupo_id')->references('id')->on('grupos')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubro_grupo');
    }
};
