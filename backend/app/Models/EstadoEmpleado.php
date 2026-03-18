<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoEmpleado extends EstadoCatalogo
{
    protected $table = 'estado_empleados';

    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'estado_empleado_id');
    }
}
