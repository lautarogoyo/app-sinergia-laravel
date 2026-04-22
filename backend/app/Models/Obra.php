<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Obra extends SinergiaModel
{
    protected $table = 'Obra';
    protected $primaryKey = 'nro_obra';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'fecha_ingreso'                   => 'date',
        'fecha_visto'                     => 'date',
        'fecha_programacion_inicio'       => 'date',
        'fecha_recepcion_provisoria'      => 'date',
        'fecha_recepcion_definitiva'      => 'date',
        'fecha_inicio_orden_compra'       => 'date',
        'fecha_finalizacion_orden_compra' => 'date',
    ];

    public function estadoObra(): BelongsTo
    {
        return $this->belongsTo(EstadoObra::class, 'estado_obra_id', 'estado_obra_id');
    }

    public function pedidoCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'nro_obra', 'nro_obra');
    }

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'nro_obra', 'nro_obra');
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class, 'nro_obra', 'nro_obra');
    }

    public function ordenCompra(): HasOne
    {
        return $this->hasOne(OrdenCompra::class, 'nro_obra', 'nro_obra');
    }

    public function ordenesCompra(): HasMany
    {
        return $this->hasMany(OrdenCompra::class, 'nro_obra', 'nro_obra');
    }

    public function gastos(): HasMany
    {
        return $this->hasMany(Gasto::class, 'nro_obra', 'nro_obra');
    }

    public function obraGrupos(): HasMany
    {
        return $this->hasMany(ObraGrupo::class, 'nro_obra', 'nro_obra');
    }

    public function grupos(): BelongsToMany
    {
        return $this->belongsToMany(
            Grupo::class,
            'Obra_Grupo',
            'nro_obra',
            'id_grupo',
            'nro_obra',
            'grupo_id'
        );
    }
}
