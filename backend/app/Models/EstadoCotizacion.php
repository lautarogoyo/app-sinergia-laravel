<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoCotizacion extends EstadoCatalogo
{
    protected $table = 'estado_cotizaciones';

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'estado_cotizacion_id');
    }
}
