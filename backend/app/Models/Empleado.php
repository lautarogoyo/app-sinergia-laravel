<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empleado extends SinergiaModel
{
    use SoftDeletes;

    protected $table = 'Empleado';

    protected $primaryKey = 'empleado_id';

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'grupo_id');
    }

    public function estadoEmpleado(): BelongsTo
    {
        return $this->belongsTo(EstadoEmpleado::class, 'id_estado', 'estado_empleado_id');
    }

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'empleado_id', 'empleado_id');
    }
}
