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
        'fecha_finalizacion_orden_compra' => 'date',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }
}
