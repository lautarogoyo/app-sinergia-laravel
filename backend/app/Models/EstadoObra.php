<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoObra extends EstadoCatalogo
{
    protected $table = 'estado_obras';

    public function obras(): HasMany
    {
        return $this->hasMany(Obra::class, 'estado_obra_id');
    }
}
