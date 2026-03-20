<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('TipoDocumento')->insert([
            ['tipoDocumento_id' => 1, 'descripcion' => 'DNI'],
            ['tipoDocumento_id' => 2, 'descripcion' => 'CUIL'],
            ['tipoDocumento_id' => 3, 'descripcion' => 'libreta_sanitaria'],
            ['tipoDocumento_id' => 4, 'descripcion' => 'registro_conducir'],
            ['tipoDocumento_id' => 5, 'descripcion' => 'curso_seguridad'],
            ['tipoDocumento_id' => 6, 'descripcion' => 'alta_temprana'],
            ['tipoDocumento_id' => 7, 'descripcion' => 'certificado_medico'],
            ['tipoDocumento_id' => 8, 'descripcion' => 'otro'],
        ]);
    }
}