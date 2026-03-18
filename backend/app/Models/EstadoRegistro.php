<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoRegistro extends EstadoCatalogo
{
    protected $table = 'estado_registros';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'estado_registro_id');
    }
}
