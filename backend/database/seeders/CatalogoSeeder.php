<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * CatalogoSeeder
 * Carga los valores iniciales de todas las tablas de catálogo (Nivel 0).
 * Ejecutar con: php artisan db:seed --class=CatalogoSeeder
 */
class CatalogoSeeder extends Seeder
{
    public function run(): void
    {
        // ── Estado_Obra ──────────────────────────────────────────────────────
        DB::table('Estado_Obra')->insert([
            ['descripcion' => 'ACTIVA'],
            ['descripcion' => 'VENCIDA'],
        ]);

        // ── Estado_Grupo ─────────────────────────────────────────────────────
        DB::table('Estado_Grupo')->insert([
            ['descripcion' => 'ACTIVO'],
            ['descripcion' => 'INACTIVO'],
        ]);

        // ── Estado_Empleado ──────────────────────────────────────────────────
        DB::table('Estado_Empleado')->insert([
            ['descripcion' => 'ACTIVO'],
            ['descripcion' => 'ARCHIVADO'],
        ]);

        // ── Estado_Documentacion ─────────────────────────────────────────────
        DB::table('Estado_Documentacion')->insert([
            ['descripcion' => 'ACTIVA'],
            ['descripcion' => 'VENCIDA'],
        ]);

        // ── Estado_Pedido ────────────────────────────────────────────────────
        DB::table('Estado_Pedido')->insert([
            ['descripcion' => 'PENDIENTE'],
            ['descripcion' => 'PEDIDO'],
        ]);

        // ── Estado_Contratista ───────────────────────────────────────────────
        DB::table('Estado_Contratista')->insert([
            ['descripcion' => 'PENDIENTE'],
            ['descripcion' => 'APTO'],
            ['descripcion' => 'ACTIVO'],
        ]);

        // ── Estado_Registro ──────────────────────────────────────────────────
        DB::table('Estado_Registro')->insert([
            ['descripcion' => 'FALTA CARGAR'],
            ['descripcion' => 'SOLICITADO'],
            ['descripcion' => 'ENTREGADO'],
        ]);

        // ── Estado_Cotizacion ────────────────────────────────────────────────
        DB::table('Estado_Cotizacion')->insert([
            ['descripcion' => 'PEDIDA PARA COTIZAR'],
            ['descripcion' => 'COTIZADA'],
            ['descripcion' => 'EN CURSO'],
            ['descripcion' => 'FINALIZADA'],
        ]);

        // ── Estado_Comparativa ───────────────────────────────────────────────
        DB::table('Estado_Comparativa')->insert([
            ['descripcion' => 'PASADO'],
            ['descripcion' => 'HACER PLANILLA'],
            ['descripcion' => 'NO LLEVA PLANILLA'],
        ]);

        // ── Tipo_Documentacion ───────────────────────────────────────────────
        // Agregar tipos según necesidad del negocio
        DB::table('Tipo_Documentacion')->insert([
            ['descripcion' => 'DNI'],
            ['descripcion' => 'MONOTRIBUTO'],
            ['descripcion' => 'ART'],
            ['descripcion' => 'SEGURO DE VIDA'],
        ]);

        // ── Tipo_Facturacion ─────────────────────────────────────────────────
        DB::table('Tipo_Facturacion')->insert([
            ['descripcion' => 'MONOTRIBUTISTA'],
            ['descripcion' => 'RESPONSABLE INSCRIPTO'],
        ]);

        // ── Rol_Pedido ───────────────────────────────────────────────────────
        DB::table('Rol_Pedido')->insert([
            ['descripcion' => 'PASADA'],
            ['descripcion' => 'DEBE PASAR'],
            ['descripcion' => 'OTRO'],
        ]);
    }
}
