<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

/**
 * CORRECCIÓN: Seeders para todas las tablas de catálogo que son requeridas
 * por las FKs. Sin estos seeders la aplicación no puede funcionar correctamente
 * porque las FKs referencian IDs que no existen.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            EstadoCatalogoSeeder::class,
            TipoDocumentoSeeder::class,
            RolPedidoSeeder::class,
        ]);

        User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}