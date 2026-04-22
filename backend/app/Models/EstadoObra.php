<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoObra extends EstadoCatalogo
{
    protected $table = 'Estado_Obra';
    protected $primaryKey = 'estado_obra_id';

    public function obras(): HasMany
    {
        return $this->hasMany(Obra::class, 'estado_obra_id', 'estado_obra_id');
    }
}
