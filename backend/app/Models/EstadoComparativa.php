<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoComparativa extends EstadoCatalogo
{
    protected $table = 'estado_comparativas';

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'estado_comparativa_id');
    }
}
