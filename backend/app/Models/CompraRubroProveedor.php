<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompraRubroProveedor extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Compra_Rubro_Proveedor';
    protected $primaryKey = ['nro_obra', 'pedido_compra_id', 'rubro_id', 'proveedor_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    public function compraRubro(): BelongsTo
    {
        return $this->belongsTo(CompraRubro::class, 'rubro_id', 'rubro_id')
            ->where('Compra_Rubro.nro_obra', $this->nro_obra)
            ->where('Compra_Rubro.pedido_compra_id', $this->pedido_compra_id);
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id', 'proveedor_id');
    }
}
