<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompraRubro extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Compra_Rubro';
    protected $primaryKey = ['nro_obra', 'pedido_compra_id', 'rubro_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    public function pedidoCompra(): BelongsTo
    {
        return $this->belongsTo(PedidoCompra::class, 'pedido_compra_id', 'pedido_compra_id')
            ->where('Pedido_Compra.nro_obra', $this->nro_obra);
    }

    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'rubro_id', 'rubro_id');
    }
}
