<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoRegistro extends EstadoCatalogo
{
    protected $table = 'Estado_Registro';

    protected $primaryKey = 'estado_registro_id';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'id_estado_registro', 'estado_registro_id');
    }
}
