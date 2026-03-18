<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PedidoCompra extends Model
{
    /** @use HasFactory<\Database\Factories\PedidoCompraFactory> */
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'pedidos_compra';
    protected $fillable = [
        'rol',
        'path_presupuesto',
        'path_material',
        'fecha_pedido',
        'fecha_entrega_estimada',
        'estado_contratista_id',
        'estado_pedido_id',
        'estado_registro_id',
        'observaciones',
        'obra_id',
        'grupo_id',
        'proveedores',
    ];

    protected $appends = ['estado_contratista', 'estado_pedido', 'estado'];

    protected $casts = [
        'fecha_pedido' => 'date',
        'fecha_entrega_estimada' => 'date',
        'proveedores' => 'array',
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
    
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Grupo::class);
    }

    public function estadoContratista(): BelongsTo
    {
        return $this->belongsTo(EstadoContratista::class, 'estado_contratista_id');
    }

    public function estadoPedido(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'estado_pedido_id');
    }

    public function estadoRegistro(): BelongsTo
    {
        return $this->belongsTo(EstadoRegistro::class, 'estado_registro_id');
    }

    public function getEstadoContratistaAttribute(): ?string
    {
        return $this->estadoContratista?->descripcion;
    }

    public function setEstadoContratistaAttribute(?string $value): void
    {
        $this->attributes['estado_contratista_id'] = $this->resolveEstadoCatalogId($value, EstadoContratista::class);
    }

    public function getEstadoPedidoAttribute(): ?string
    {
        return $this->estadoPedido?->descripcion;
    }

    public function setEstadoPedidoAttribute(?string $value): void
    {
        $this->attributes['estado_pedido_id'] = $this->resolveEstadoCatalogId($value, EstadoPedido::class);
    }

    public function getEstadoAttribute(): ?string
    {
        return $this->estadoRegistro?->descripcion;
    }

    public function setEstadoAttribute(?string $value): void
    {
        $this->attributes['estado_registro_id'] = $this->resolveEstadoCatalogId($value, EstadoRegistro::class);
    }

}
