<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Usuario::updateOrCreate(
            ['nombreUsuario' => 'LautaroSinergia'],
            [
                'email' => 'lautaro@sinergia.local',
                'nombre' => 'Lautaro',
                'apellido' => 'Admin',
                'contrasenia' => 'LautaroSinergia',
            ]
        );
    }
}
