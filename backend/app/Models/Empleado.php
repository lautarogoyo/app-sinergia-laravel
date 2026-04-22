<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends SinergiaModel
{
    protected $table = 'Empleado';
    protected $primaryKey = 'empleado_id';

    protected $casts = [
        'archivado_at' => 'date',
        'cancelado_at' => 'date',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id', 'grupo_id');
    }

    public function estadoEmpleado(): BelongsTo
    {
        return $this->belongsTo(EstadoEmpleado::class, 'estado_empleado_id', 'estado_empleado_id');
    }

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'empleado_id', 'empleado_id');
    }
}
