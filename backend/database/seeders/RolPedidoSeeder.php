<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolPedidoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('RolPedido')->insert([
            ['rol_id' => 1, 'descripcion' => 'cotizar'],
            ['rol_id' => 2, 'descripcion' => 'comprar'],
        ]);
    }
}