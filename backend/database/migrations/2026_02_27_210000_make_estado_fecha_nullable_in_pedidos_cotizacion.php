<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE pedidos_cotizacion
            MODIFY fecha_cierre_cotizacion DATE NULL,
            MODIFY estado_cotizacion ENUM('pasada','debe_pasar','otro') NULL,
            MODIFY estado_comparativa ENUM('pasado','hacer_planilla','no_lleva') NULL
        ");
    }

    public function down(): void
    {
        DB::statement("
            UPDATE pedidos_cotizacion
            SET fecha_cierre_cotizacion = COALESCE(fecha_cierre_cotizacion, CURDATE()),
                estado_cotizacion = COALESCE(estado_cotizacion, 'otro'),
                estado_comparativa = COALESCE(estado_comparativa, 'no_lleva')
        ");

        DB::statement("
            ALTER TABLE pedidos_cotizacion
            MODIFY fecha_cierre_cotizacion DATE NOT NULL,
            MODIFY estado_cotizacion ENUM('pasada','debe_pasar','otro') NOT NULL,
            MODIFY estado_comparativa ENUM('pasado','hacer_planilla','no_lleva') NOT NULL
        ");
    }
};
