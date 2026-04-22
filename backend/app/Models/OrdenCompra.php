<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrdenCompra extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Orden_Compra';
    protected $primaryKey = ['nro_oc', 'nro_obra'];
    public $incrementing = false;
    protected $keyType = 'array';

    protected $casts = [
        'importe' => 'decimal:2',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'nro_obra', 'nro_obra');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id', 'grupo_id');
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class, 'nro_oc', 'nro_oc')
            ->where('nro_obra', $this->nro_obra);
    }
}
