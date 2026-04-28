<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoEmpleado extends EstadoCatalogo
{
    protected $table = 'Estado_Empleado';
    protected $primaryKey = 'estado_empleado_id';

    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'estado_empleado_id', 'estado_empleado_id');
    }
}
