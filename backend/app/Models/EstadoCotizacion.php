<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoCotizacion extends EstadoCatalogo
{
    protected $table = 'Estado_Cotizacion';

    protected $primaryKey = 'estado_cotizacion_id';

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'id_estado_cotizacion', 'estado_cotizacion_id');
    }
}
