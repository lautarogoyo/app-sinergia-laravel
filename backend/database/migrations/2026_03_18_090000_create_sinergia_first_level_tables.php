<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Estado_Obra', function (Blueprint $table) {
            $table->increments('estado_obra_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Empleado', function (Blueprint $table) {
            $table->increments('estado_empleado_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Grupo', function (Blueprint $table) {
            $table->increments('estado_grupo_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Cotizacion', function (Blueprint $table) {
            $table->increments('estado_cotizacion_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Comparativa', function (Blueprint $table) {
            $table->increments('estado_comparativa_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Contratista', function (Blueprint $table) {
            $table->increments('estado_contratista_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Pedido', function (Blueprint $table) {
            $table->increments('estado_pedido_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Registro', function (Blueprint $table) {
            $table->increments('estado_registro_id');
            $table->string('descripcion');
        });

        Schema::create('Estado_Documentacion', function (Blueprint $table) {
            $table->increments('estado_documentacion_id');
            $table->string('descripcion');
        });

        Schema::create('RolPedido', function (Blueprint $table) {
            $table->increments('rol_id');
            $table->string('descripcion');
        });

        Schema::create('Usuario', function (Blueprint $table) {
            $table->increments('usuario_id');
            $table->string('email');
            $table->string('contrasenia');
            $table->string('nombre');
            $table->string('apellido');
        });

        Schema::create('Rubro', function (Blueprint $table) {
            $table->increments('rubro_id');
            $table->string('descripcion');
        });

        Schema::create('TipoDocumento', function (Blueprint $table) {
            $table->increments('tipoDocumento_id');
            $table->string('descripcion');
        });

        Schema::create('Grupo', function (Blueprint $table) {
            $table->increments('grupo_id');
            $table->string('denominacion');
            $table->unsignedInteger('id_estado');

            $table->foreign('id_estado')
                ->references('estado_grupo_id')
                ->on('Estado_Grupo')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Obra', function (Blueprint $table) {
            $table->increments('obra_id');
            $table->integer('nro_obra');
            $table->string('detalle');
            $table->date('fecha_ingreso');
            $table->date('fecha_visto');
            $table->date('fecha_programacion_inicio')->nullable();
            $table->date('fecha_recepcion_provisoria')->nullable();
            $table->date('fecha_recepcion_definitiva')->nullable();
            $table->string('detalle_caratula')->nullable();
            $table->unsignedInteger('id_estado_obra');
            $table->softDeletes();

            $table->foreign('id_estado_obra')
                ->references('estado_obra_id')
                ->on('Estado_Obra')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Empleado', function (Blueprint $table) {
            $table->increments('empleado_id');
            $table->string('nombre');
            $table->string('apellido');
            $table->string('telefono');
            $table->string('cbu')->nullable();
            $table->string('alias')->nullable();
            $table->unsignedInteger('id_grupo');
            $table->unsignedInteger('id_estado');
            $table->softDeletes();

            $table->foreign('id_grupo')
                ->references('grupo_id')
                ->on('Grupo')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_estado')
                ->references('estado_empleado_id')
                ->on('Estado_Empleado')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Proveedor', function (Blueprint $table) {
            $table->increments('proveedor_id');
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->boolean('monotributista');
            $table->string('direccion')->nullable();
            $table->string('comentario')->nullable();
            $table->date('fecha_ingreso');
            $table->string('metodo_pago')->nullable();
            $table->unsignedInteger('usuario_id');
            $table->softDeletes();

            $table->foreign('usuario_id')
                ->references('usuario_id')
                ->on('Usuario')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Proveedor');
        Schema::dropIfExists('Empleado');
        Schema::dropIfExists('Obra');
        Schema::dropIfExists('Grupo');
        Schema::dropIfExists('TipoDocumento');
        Schema::dropIfExists('Rubro');
        Schema::dropIfExists('Usuario');
        Schema::dropIfExists('RolPedido');
        Schema::dropIfExists('Estado_Documentacion');
        Schema::dropIfExists('Estado_Registro');
        Schema::dropIfExists('Estado_Pedido');
        Schema::dropIfExists('Estado_Contratista');
        Schema::dropIfExists('Estado_Comparativa');
        Schema::dropIfExists('Estado_Cotizacion');
        Schema::dropIfExists('Estado_Grupo');
        Schema::dropIfExists('Estado_Empleado');
        Schema::dropIfExists('Estado_Obra');
    }
};
