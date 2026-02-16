<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Rubro;
use App\Models\Obra;


class PedidoCompra extends Model
{
    /** @use HasFactory<\Database\Factories\PedidoCompraFactory> */
    use HasFactory;
    protected $table = 'pedidos_compra';
    protected $fillable = [
        'rol',
        'path_presupuesto',
        'path_material',
        'fecha_pedido',
        'fecha_entrega_estimada',
        'estado_contratista',
        'estado_pedido',
        'estado',
        'observaciones',
        'obra_id',
    ];

    protected $casts = [
        'fecha_pedido' => 'date',
        'fecha_entrega_estimada' => 'date',
    ];

    public function rubros() : BelongsToMany
    {
        return $this->belongsToMany(Rubro::class, 'compra_rubro',
            'pedido_id',
            'rubro_id')->withTimestamps();
    }

    public function obra() : BelongsTo
    {
        return $this->belongsTo(Obra::class);
    }

}
