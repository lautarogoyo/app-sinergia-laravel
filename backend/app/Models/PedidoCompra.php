<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PedidoCompra extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Pedido_Compra';

    protected $primaryKey = ['obra_id', 'pedido_compra_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    protected $casts = [
        'fecha_pedido' => 'date',
        'fecha_entrega_estimada' => 'date',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }

    public function estadoContratista(): BelongsTo
    {
        return $this->belongsTo(EstadoContratista::class, 'id_estado_contratista', 'estado_contratista_id');
    }

    public function estadoPedido(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'id_estado_pedido', 'estado_pedido_id');
    }

    public function estadoRegistro(): BelongsTo
    {
        return $this->belongsTo(EstadoRegistro::class, 'id_estado_registro', 'estado_registro_id');
    }

    public function rolPedido(): BelongsTo
    {
        return $this->belongsTo(RolPedido::class, 'id_rol', 'rol_id');
    }

    public function compraRubros(): HasMany
    {
        return $this->hasMany(CompraRubro::class, 'pedido_compra_id', 'pedido_compra_id')
            ->where('obra_id', $this->obra_id);
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
        )->withPivot('obra_id')
            ->wherePivot('obra_id', $this->obra_id);
    }
}
