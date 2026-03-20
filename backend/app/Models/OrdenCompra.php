<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrdenCompra extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Orden_Compra';

    protected $primaryKey = ['obra_id', 'orden_compra_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    protected $casts = [
        'fecha_inicio_orden_compra' => 'date',
        // CORRECCIÓN: nombre alineado con la migración y el controller
        'fecha_fin_orden_compra'    => 'date',
    ];

    /**
     * CORRECCIÓN: genera orden_compra_id automáticamente.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->orden_compra_id)) {
                $model->orden_compra_id = $model->resolveNextSequentialId(
                    'orden_compra_id',
                    'obra_id'
                );
            }
        });
    }

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }
}