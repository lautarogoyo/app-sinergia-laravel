<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoPedido extends EstadoCatalogo
{
    protected $table = 'Estado_Pedido';
    protected $primaryKey = 'estado_pedido_id';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'estado_pedido_id', 'estado_pedido_id');
    }
}
