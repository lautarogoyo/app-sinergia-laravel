<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrdenCompra extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Orden_Compra';
    protected $primaryKey = ['nro_oc', 'obra_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    protected $fillable = [
        'nro_oc',
        'obra_id',
        'grupo_id',
        'detalle',
        'importe',
    ];

    protected $casts = [
        'importe' => 'decimal:2',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id', 'grupo_id');
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class, 'nro_oc', 'nro_oc')
            ->where('obra_id', $this->obra_id);
    }
}
