<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoComparativa extends EstadoCatalogo
{
    protected $table = 'Estado_Comparativa';
    protected $primaryKey = 'estado_comparativa_id';

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'estado_comparativa_id', 'estado_comparativa_id');
    }
}
