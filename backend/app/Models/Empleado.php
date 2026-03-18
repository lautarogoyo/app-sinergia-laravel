<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    use SoftDeletes;
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'empleados';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'cbu',
        'alias',
        'estado_empleado_id',
        'grupo_id',
    ];

    protected $appends = ['estado'];
    
    public function documentaciones() : HasMany
    {
        return $this->hasMany(Documentacion::class);
    }

    public function grupo() : BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }

    public function estadoEmpleado() : BelongsTo
    {
        return $this->belongsTo(EstadoEmpleado::class, 'estado_empleado_id');
    }

    public function getEstadoAttribute(): ?string
    {
        return $this->estadoEmpleado?->descripcion;
    }

    public function setEstadoAttribute(?string $value): void
    {
        $this->attributes['estado_empleado_id'] = $this->resolveEstadoCatalogId($value, EstadoEmpleado::class);
    }
}
