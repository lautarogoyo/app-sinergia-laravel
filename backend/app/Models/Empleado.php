<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends SinergiaModel
{
    protected $table = 'Empleado';
    protected $primaryKey = 'empleado_id';

    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'cbu',
        'alias',
        'grupo_id',
        'estado_empleado_id',
        'archived_at',
        'canceled_at',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
        'canceled_at' => 'datetime',
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
