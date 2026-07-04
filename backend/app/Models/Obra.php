<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Obra extends SinergiaModel
{
    protected $table = 'Obra';
    protected $primaryKey = 'obra_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nro_obra',
        'detalle',
        'estado_obra_id',
        'fecha_visto',
        'fecha_ingreso',
        'fecha_programacion_inicio',
        'fecha_recepcion_provisoria',
        'fecha_recepcion_definitiva',
        'fecha_inicio_orden_compra',
        'fecha_finalizacion_orden_compra',
        'detalle_caratula',
    ];

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

    public function ordenCompra(): HasOne
    {
        return $this->hasOne(OrdenCompra::class, 'obra_id', 'obra_id');
    }

    public function ordenesCompra(): HasMany
    {
        return $this->hasMany(OrdenCompra::class, 'obra_id', 'obra_id');
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class, 'obra_id', 'obra_id');
    }

    public function gastos(): HasMany
    {
        return $this->hasMany(Gasto::class, 'obra_id', 'obra_id');
    }

    public function obraGrupos(): HasMany
    {
        return $this->hasMany(ObraGrupo::class, 'obra_id', 'obra_id');
    }

    public function grupos(): BelongsToMany
    {
        return $this->belongsToMany(
            Grupo::class,
            'Obra_Grupo',
            'obra_id',
            'grupo_id',
            'obra_id',
            'grupo_id'
        );
    }
}
