<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Obra extends SinergiaModel
{
    use SoftDeletes;

    protected $table = 'Obra';

    protected $primaryKey = 'obra_id';

    protected $casts = [
        'fecha_ingreso' => 'date',
        'fecha_visto' => 'date',
        'fecha_programacion_inicio' => 'date',
        'fecha_recepcion_provisoria' => 'date',
        'fecha_recepcion_definitiva' => 'date',
        'deleted_at' => 'datetime',
    ];

    public function estadoObra(): BelongsTo
    {
        return $this->belongsTo(EstadoObra::class, 'id_estado_obra', 'estado_obra_id');
    }

    public function pedidosCompra(): HasMany
    {
        return $this->hasMany(PedidoCompra::class, 'obra_id', 'obra_id');
    }

    public function pedidosCotizacion(): HasMany
    {
        return $this->hasMany(PedidoCotizacion::class, 'obra_id', 'obra_id');
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class, 'obra_id', 'obra_id');
    }

    public function ordenesCompra(): HasMany
    {
        return $this->hasMany(OrdenCompra::class, 'obra_id', 'obra_id');
    }

    public function obraGrupos(): HasMany
    {
        return $this->hasMany(ObraGrupo::class, 'id_obra', 'obra_id');
    }

    public function grupos(): BelongsToMany
    {
        return $this->belongsToMany(
            Grupo::class,
            'Obra_grupo',
            'id_obra',
            'id_grupo',
            'obra_id',
            'grupo_id'
        );
    }
}
