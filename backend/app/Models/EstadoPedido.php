<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoPedido extends EstadoCatalogo
{
    protected $table = 'estado_pedidos';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'estado_pedido_id');
    }
}
