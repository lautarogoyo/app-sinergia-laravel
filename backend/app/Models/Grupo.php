<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends Model
{
    /** @use HasFactory<\Database\Factories\GrupoFactory> */
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'grupos';

    protected $fillable = [
        'denominacion',
        'estado_grupo_id',
    ];

    protected $appends = ['estado'];
    public function empleados() : HasMany
    {
        return $this->hasMany(Empleado::class);
    }

    public function obras() : BelongsToMany
    {
        return $this->belongsToMany(Obra::class,'obra_grupo',
            'grupo_id',
            'obra_id')->withTimestamps();
    }

    public function rubros() : BelongsToMany
    {
        return $this->belongsToMany(
            Rubro::class,
            'rubro_grupo',
            'grupo_id',
            'rubro_id'
        )->withTimestamps();
    }

    public function estadoGrupo(): BelongsTo
    {
        return $this->belongsTo(EstadoGrupo::class, 'estado_grupo_id');
    }

    public function getEstadoAttribute(): ?string
    {
        return $this->estadoGrupo?->descripcion;
    }

    public function setEstadoAttribute(?string $value): void
    {
        $this->attributes['estado_grupo_id'] = $this->resolveEstadoCatalogId($value, EstadoGrupo::class);
    }
}
