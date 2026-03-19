<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Pedido_Compra', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_compra_id');
            $table->string('path_presupuesto')->nullable();
            $table->string('path_material')->nullable();
            $table->date('fecha_pedido');
            $table->date('fecha_entrega_estimada')->nullable();
            $table->string('observaciones')->nullable();
            $table->unsignedInteger('id_estado_contratista')->nullable();
            $table->unsignedInteger('id_estado_pedido');
            $table->unsignedInteger('id_estado_registro');
            $table->unsignedInteger('id_rol');

            $table->primary(['obra_id', 'pedido_compra_id']);

            $table->foreign('obra_id')
                ->references('obra_id')
                ->on('Obra')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_estado_contratista')
                ->references('estado_contratista_id')
                ->on('Estado_Contratista')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_estado_pedido')
                ->references('estado_pedido_id')
                ->on('Estado_Pedido')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_estado_registro')
                ->references('estado_registro_id')
                ->on('Estado_Registro')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_rol')
                ->references('rol_id')
                ->on('RolPedido')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Pedido_Cotizacion', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_cotizacion_id');
            $table->string('path_archivo')->nullable();
            $table->string('path_archivo_mano_obra')->nullable();
            $table->date('fecha_cierre_cotizacion')->nullable();
            $table->unsignedInteger('id_estado_cotizacion');
            $table->unsignedInteger('id_estado_comparativa');

            $table->primary(['obra_id', 'pedido_cotizacion_id']);

            $table->foreign('obra_id')
                ->references('obra_id')
                ->on('Obra')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_estado_cotizacion')
                ->references('estado_cotizacion_id')
                ->on('Estado_Cotizacion')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_estado_comparativa')
                ->references('estado_comparativa_id')
                ->on('Estado_Comparativa')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Comentario', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('comentario_id');
            $table->string('detalle');

            $table->primary(['obra_id', 'comentario_id']);

            $table->foreign('obra_id')
                ->references('obra_id')
                ->on('Obra')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('Orden_Compra', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('orden_compra_id');
            $table->integer('nro_oc');
            $table->string('detalle');
            $table->date('fecha_inicio_orden_compra')->nullable();
            $table->date('fecha_finalizacion_orden_compra')->nullable();

            $table->primary(['obra_id', 'orden_compra_id']);

            $table->foreign('obra_id')
                ->references('obra_id')
                ->on('Obra')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('Documentacion', function (Blueprint $table) {
            $table->unsignedInteger('empleado_id');
            $table->unsignedInteger('documentacion_id');
            $table->string('path');
            $table->date('fecha_vencimiento');
            $table->unsignedInteger('id_tipoDocumento');
            $table->unsignedInteger('id_estado_documentacion');

            $table->primary(['empleado_id', 'documentacion_id']);

            $table->foreign('empleado_id')
                ->references('empleado_id')
                ->on('Empleado')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_tipoDocumento')
                ->references('tipoDocumento_id')
                ->on('TipoDocumento')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_estado_documentacion')
                ->references('estado_documentacion_id')
                ->on('Estado_Documentacion')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('Obra_grupo', function (Blueprint $table) {
            $table->unsignedInteger('id_obra');
            $table->unsignedInteger('id_grupo');

            $table->primary(['id_obra', 'id_grupo']);

            $table->foreign('id_obra')
                ->references('obra_id')
                ->on('Obra')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_grupo')
                ->references('grupo_id')
                ->on('Grupo')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('Proveedor_Rubro', function (Blueprint $table) {
            $table->unsignedInteger('proveedor_id');
            $table->unsignedInteger('rubro_id');

            $table->primary(['proveedor_id', 'rubro_id']);

            $table->foreign('proveedor_id')
                ->references('proveedor_id')
                ->on('Proveedor')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('rubro_id')
                ->references('rubro_id')
                ->on('Rubro')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Proveedor_Rubro');
        Schema::dropIfExists('Obra_grupo');
        Schema::dropIfExists('Documentacion');
        Schema::dropIfExists('Orden_Compra');
        Schema::dropIfExists('Comentario');
        Schema::dropIfExists('Pedido_Cotizacion');
        Schema::dropIfExists('Pedido_Compra');
    }
};
