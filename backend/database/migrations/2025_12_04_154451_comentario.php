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
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->string('denominacion')->nullable();
            $table->unsignedBigInteger('id_obra')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('obras')) {
            Schema::table('comentarios', function (Blueprint $table) {
                $table->foreign('id_obra')->references('id')->on('obras')->onUpdate('cascade')->onDelete('restrict');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
