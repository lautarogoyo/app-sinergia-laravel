<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class RolPedido extends SinergiaModel
{
    protected $table = 'RolPedido';

    protected $primaryKey = 'rol_id';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'id_rol', 'rol_id');
    }
}
