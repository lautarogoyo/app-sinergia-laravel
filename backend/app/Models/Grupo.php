<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends SinergiaModel
{
    protected $table = 'Grupo';
    protected $primaryKey = 'grupo_id';

    protected $casts = [
        'fecha_ingreso' => 'date',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'usuario_id');
    }

    public function tipoFacturacion(): BelongsTo
    {
        return $this->belongsTo(TipoFacturacion::class, 'tipo_facturacion_id', 'tipo_facturacion_id');
    }

    public function estadoGrupo(): BelongsTo
    {
        return $this->belongsTo(EstadoGrupo::class, 'estado_grupo_id', 'estado_grupo_id');
    }

    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'grupo_id', 'grupo_id');
    }

    public function obraGrupos(): HasMany
    {
        return $this->hasMany(ObraGrupo::class, 'id_grupo', 'grupo_id');
    }

    public function obras(): BelongsToMany
    {
        return $this->belongsToMany(
            Obra::class,
            'Obra_Grupo',
            'id_grupo',
            'nro_obra',
            'grupo_id',
            'nro_obra'
        );
    }

    public function compraRubroGrupos(): HasMany
    {
        return $this->hasMany(CompraRubroGrupo::class, 'grupo_id', 'grupo_id');
    }
}
