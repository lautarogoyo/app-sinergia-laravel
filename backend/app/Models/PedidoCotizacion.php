<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCotizacion extends SinergiaModel
{
    protected $table = 'Pedido_Cotizacion';
    protected $primaryKey = 'pedido_cotizacion_id';

    protected $casts = [
        'fecha_cierre_cotizacion' => 'date',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'nro_obra', 'nro_obra');
    }

    public function estadoCotizacion(): BelongsTo
    {
        return $this->belongsTo(EstadoCotizacion::class, 'estado_cotizacion_id', 'estado_cotizacion_id');
    }

    public function estadoComparativa(): BelongsTo
    {
        return $this->belongsTo(EstadoComparativa::class, 'estado_comparativa_id', 'estado_comparativa_id');
    }
}
