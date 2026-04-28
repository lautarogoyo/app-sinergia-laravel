<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoGrupo extends EstadoCatalogo
{
    protected $table = 'Estado_Grupo';
    protected $primaryKey = 'estado_grupo_id';

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class, 'estado_grupo_id', 'estado_grupo_id');
    }
}
