<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends SinergiaModel
{
    protected $table = 'Grupo';

    protected $primaryKey = 'grupo_id';

    /**
     * CORRECCIÓN: estado es un campo string directo en la tabla.
     * estadoGrupo() sigue disponible si se usa la FK opcional.
     */
    public function estadoGrupo(): BelongsTo
    {
        return $this->belongsTo(EstadoGrupo::class, 'id_estado', 'estado_grupo_id');
    }

    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'id_grupo', 'grupo_id');
    }

    public function obraGrupos(): HasMany
    {
        return $this->hasMany(ObraGrupo::class, 'id_grupo', 'grupo_id');
    }

    public function obras(): BelongsToMany
    {
        return $this->belongsToMany(
            Obra::class,
            'Obra_grupo',
            'id_grupo',
            'id_obra',
            'grupo_id',
            'obra_id'
        );
    }

    public function compraRubroGrupos(): HasMany
    {
        return $this->hasMany(CompraRubroGrupo::class, 'grupo_id', 'grupo_id');
    }
}