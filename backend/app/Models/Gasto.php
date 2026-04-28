<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gasto extends SinergiaModel
{
    protected $table = 'Gasto';
    protected $primaryKey = 'gasto_id';

    protected $casts = [
        'importe_real'        => 'decimal:2',
        'importe_proyeccion'  => 'decimal:2',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'nro_obra', 'nro_obra');
    }
}
