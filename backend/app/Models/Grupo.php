<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends SinergiaModel
{
    protected $table = 'Grupo';
    protected $primaryKey = 'grupo_id';

    protected $fillable = [
        'nombre_apellido',
        'usuario_id',
        'tipo_facturacion_id',
        'estado_grupo_id',
        'telefono',
        'cuit',
        'cbu',
        'alias',
        'email',
        'ciudad',
        'calificacion',
        'contacto',
        'observacion',
        'fecha_ingreso',
        'rol_profesional',
        'especialidad',
    ];

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
        return $this->hasMany(ObraGrupo::class, 'grupo_id', 'grupo_id');
    }

    public function obras(): BelongsToMany
    {
        return $this->belongsToMany(
            Obra::class,
            'Obra_Grupo',
            'grupo_id',
            'obra_id',
            'grupo_id',
            'obra_id'
        );
    }

    public function compraRubroGrupos(): HasMany
    {
        return $this->hasMany(CompraRubroGrupo::class, 'grupo_id', 'grupo_id');
    }
    public function rubros(): BelongsToMany
    {
            return $this->belongsToMany(
                Rubro::class,
                'Grupo_Rubro',
                'grupo_id',
                'rubro_id',
                'grupo_id',
                'rubro_id'
            );
    }
}

