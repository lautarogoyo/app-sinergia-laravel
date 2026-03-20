<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCotizacion extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Pedido_Cotizacion';

    protected $primaryKey = ['obra_id', 'pedido_cotizacion_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    protected $casts = [
        'fecha_cierre_cotizacion' => 'date',
    ];

    /**
     * CORRECCIÓN: genera pedido_cotizacion_id automáticamente.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->pedido_cotizacion_id)) {
                $model->pedido_cotizacion_id = $model->resolveNextSequentialId(
                    'pedido_cotizacion_id',
                    'obra_id'
                );
            }
        });
    }

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }

    public function estadoCotizacion(): BelongsTo
    {
        return $this->belongsTo(EstadoCotizacion::class, 'id_estado_cotizacion', 'estado_cotizacion_id');
    }

    public function estadoComparativa(): BelongsTo
    {
        return $this->belongsTo(EstadoComparativa::class, 'id_estado_comparativa', 'estado_comparativa_id');
    }
}