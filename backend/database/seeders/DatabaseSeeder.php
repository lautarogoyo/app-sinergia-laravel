<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Carga los catálogos iniciales y el usuario administrador.
     * Ejecutar con: php artisan migrate:fresh --seed
     */
    public function run(): void
    {
        $this->call([
            CatalogoSeeder::class,
            AdminSeeder::class,
        ]);
    }
}
