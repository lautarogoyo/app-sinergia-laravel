<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PedidoCompra extends SinergiaModel
{
    protected $table = 'Pedido_Compra';
    protected $primaryKey = 'pedido_compra_id';

    protected $casts = [
        'fecha_pedido'           => 'date',
        'fecha_entrega_estimada' => 'date',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'nro_obra', 'nro_obra');
    }

    public function rolPedido(): BelongsTo
    {
        return $this->belongsTo(RolPedido::class, 'rol_pedido_id', 'rol_id');
    }

    public function estadoContratista(): BelongsTo
    {
        return $this->belongsTo(EstadoContratista::class, 'estado_contratista_id', 'estado_contratista_id');
    }

    public function estadoPedido(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'estado_pedido_id', 'estado_pedido_id');
    }

    public function estadoRegistro(): BelongsTo
    {
        return $this->belongsTo(EstadoRegistro::class, 'estado_registro_id', 'estado_registro_id');
    }

    public function compraRubros(): HasMany
    {
        return $this->hasMany(CompraRubro::class, 'pedido_compra_id', 'pedido_compra_id')
            ->where('nro_obra', $this->nro_obra);
    }

    public function rubros(): BelongsToMany
    {
        return $this->belongsToMany(
            Rubro::class,
            'Compra_Rubro',
            'pedido_compra_id',
            'rubro_id',
            'pedido_compra_id',
            'rubro_id'
        )->withPivot('nro_obra')
            ->wherePivot('nro_obra', $this->nro_obra);
    }
}
