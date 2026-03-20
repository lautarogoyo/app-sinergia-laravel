<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * CORRECCIÓN: Este seeder faltaba completamente en el proyecto original.
 * Las tablas de estado son referenciadas por FKs en todo el sistema.
 * Sin datos aquí, ninguna creación de entidad con FK de estado funciona.
 */
class EstadoCatalogoSeeder extends Seeder
{
    public function run(): void
    {
        // Estado_Obra
        DB::table('Estado_Obra')->insert([
            ['estado_obra_id' => 1, 'descripcion' => 'pedida'],
            ['estado_obra_id' => 2, 'descripcion' => 'cotizada'],
            ['estado_obra_id' => 3, 'descripcion' => 'enCurso'],
            ['estado_obra_id' => 4, 'descripcion' => 'finalizada'],
        ]);

        // Estado_Empleado
        DB::table('Estado_Empleado')->insert([
            ['estado_empleado_id' => 1, 'descripcion' => 'activo'],
            ['estado_empleado_id' => 2, 'descripcion' => 'inactivo'],
        ]);

        // Estado_Grupo
        DB::table('Estado_Grupo')->insert([
            ['estado_grupo_id' => 1, 'descripcion' => 'pendiente'],
            ['estado_grupo_id' => 2, 'descripcion' => 'apto'],
            ['estado_grupo_id' => 3, 'descripcion' => 'activo'],
        ]);

        // Estado_Cotizacion
        DB::table('Estado_Cotizacion')->insert([
            ['estado_cotizacion_id' => 1, 'descripcion' => 'debe_pasar'],
            ['estado_cotizacion_id' => 2, 'descripcion' => 'pasada'],
            ['estado_cotizacion_id' => 3, 'descripcion' => 'otro'],
        ]);

        // Estado_Comparativa
        DB::table('Estado_Comparativa')->insert([
            ['estado_comparativa_id' => 1, 'descripcion' => 'hacer_planilla'],
            ['estado_comparativa_id' => 2, 'descripcion' => 'pasado'],
            ['estado_comparativa_id' => 3, 'descripcion' => 'no_lleva'],
        ]);

        // Estado_Contratista
        DB::table('Estado_Contratista')->insert([
            ['estado_contratista_id' => 1, 'descripcion' => 'Falta Cargar'],
            ['estado_contratista_id' => 2, 'descripcion' => 'Solicitado'],
            ['estado_contratista_id' => 3, 'descripcion' => 'Entregado'],
        ]);

        // Estado_Pedido
        DB::table('Estado_Pedido')->insert([
            ['estado_pedido_id' => 1, 'descripcion' => 'pendiente'],
            ['estado_pedido_id' => 2, 'descripcion' => 'pedido'],
        ]);

        // Estado_Registro (activo/archivado)
        DB::table('Estado_Registro')->insert([
            ['estado_registro_id' => 1, 'descripcion' => 'activo'],
            ['estado_registro_id' => 2, 'descripcion' => 'archivado'],
        ]);

        // Estado_Documentacion
        DB::table('Estado_Documentacion')->insert([
            ['estado_documentacion_id' => 1, 'descripcion' => 'vigente'],
            ['estado_documentacion_id' => 2, 'descripcion' => 'vencido'],
        ]);
    }
}