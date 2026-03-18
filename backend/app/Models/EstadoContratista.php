<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoContratista extends EstadoCatalogo
{
    protected $table = 'estado_contratistas';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'estado_contratista_id');
    }
}
