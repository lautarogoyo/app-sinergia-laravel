<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCotizacion extends SinergiaModel
{
    protected $table = 'Pedido_Cotizacion';
    protected $primaryKey = 'pedido_cotizacion_id';

    protected $fillable = [
        'obra_id',
        'path_archivo',
        'path_archivo_mano_obra',
        'fecha_cierre_cotizacion',
        'estado_cotizacion_id',
        'estado_comparativa_id',
    ];

    protected $casts = [
        'fecha_cierre_cotizacion' => 'date',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
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
