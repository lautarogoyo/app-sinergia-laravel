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
            // CORRECCIÓN: autoIncrement no funciona en PK compuesta en MySQL.
            // Usamos unsignedInteger y generamos el ID en el modelo con un observer/boot.
            $table->unsignedInteger('pedido_compra_id');
            $table->string('path_presupuesto')->nullable();
            $table->string('path_material')->nullable();
            $table->date('fecha_pedido');
            $table->date('fecha_entrega_estimada')->nullable();
            $table->text('observaciones')->nullable();
            // CORRECCIÓN: estados como strings directos (lo que realmente guarda el sistema)
            $table->string('estado_contratista')->default('Falta Cargar')->nullable();
            $table->string('estado_pedido')->default('pendiente');
            $table->string('estado')->default('activo'); // activo/archivado
            $table->string('rol')->default('cotizar');
            // FKs opcionales para catálogos (si se usan en el futuro)
            $table->unsignedInteger('id_estado_contratista')->nullable();
            $table->unsignedInteger('id_estado_pedido')->nullable();
            $table->unsignedInteger('id_estado_registro')->nullable();
            $table->unsignedInteger('id_rol')->nullable();
            // Relaciones directas usadas por el frontend
            $table->unsignedInteger('grupo_id')->nullable();
            $table->json('proveedores')->nullable(); // array de strings de proveedores

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

            $table->foreign('grupo_id')
                ->references('grupo_id')
                ->on('Grupo')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });

        Schema::create('Pedido_Cotizacion', function (Blueprint $table) {
            $table->unsignedInteger('obra_id');
            $table->unsignedInteger('pedido_cotizacion_id');
            // CORRECCIÓN: nombres de columnas alineados con lo que usa el controller
            $table->string('path_archivo_cotizacion')->nullable();
            $table->string('path_archivo_mano_obra')->nullable();
            $table->date('fecha_cierre_cotizacion')->nullable();
            // CORRECCIÓN: estados como strings directos
            $table->string('estado_cotizacion')->nullable();
            $table->string('estado_comparativa')->nullable();
            // FKs opcionales
            $table->unsignedInteger('id_estado_cotizacion')->nullable();
            $table->unsignedInteger('id_estado_comparativa')->nullable();

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
            // CORRECCIÓN: el modelo y controller usan 'denominacion', no 'detalle'
            $table->text('denominacion');
            $table->timestamps();

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
            // CORRECCIÓN: nro_orden_compra como string (el frontend envía strings)
            $table->string('nro_orden_compra')->nullable();
            $table->text('detalle')->nullable();
            $table->date('fecha_inicio_orden_compra')->nullable();
            // CORRECCIÓN: nombre alineado con controller (fecha_fin_orden_compra)
            $table->date('fecha_fin_orden_compra')->nullable();

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
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            // CORRECCIÓN: estado como string directo
            $table->string('estado')->default('vigente')->nullable();
            $table->unsignedInteger('id_tipoDocumento');
            $table->unsignedInteger('id_estado_documentacion')->nullable();

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