<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class RolPedido extends SinergiaModel
{
    protected $table = 'Rol_Pedido';
    protected $primaryKey = 'rol_id';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'rol_pedido_id', 'rol_id');
    }
}
