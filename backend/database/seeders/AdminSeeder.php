<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $cfg = config('admin');

        if (empty($cfg['username']) || empty($cfg['email']) || empty($cfg['password'])) {
            $this->command->warn('AdminSeeder: faltan ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD. No se creó nada.');

            return;
        }

        $usuario = Usuario::firstOrCreate(
            ['nombre_usuario' => $cfg['username']],
            [
                'email' => $cfg['email'],
                'contrasenia' => $cfg['password'],
                'nombre' => $cfg['nombre'],
                'apellido' => $cfg['apellido'],
                'admin' => true,
            ]
        );

        $this->command->info($usuario->wasRecentlyCreated
            ? "Admin '{$usuario->nombre_usuario}' creado."
            : "Admin '{$usuario->nombre_usuario}' ya existía, no se modificó.");
    }
}
