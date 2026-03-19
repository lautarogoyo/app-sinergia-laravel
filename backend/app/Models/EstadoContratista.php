<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoContratista extends EstadoCatalogo
{
    protected $table = 'Estado_Contratista';

    protected $primaryKey = 'estado_contratista_id';

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'id_estado_contratista', 'estado_contratista_id');
    }
}
