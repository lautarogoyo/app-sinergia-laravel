<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoGrupo extends EstadoCatalogo
{
    protected $table = 'estado_grupos';

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class, 'estado_grupo_id');
    }
}
