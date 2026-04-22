<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompraRubro extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Compra_Rubro';
    protected $primaryKey = ['nro_obra', 'pedido_compra_id', 'rubro_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    public function pedidoCompra(): BelongsTo
    {
        return $this->belongsTo(PedidoCompra::class, 'pedido_compra_id', 'pedido_compra_id')
            ->where('Pedido_Compra.nro_obra', $this->nro_obra);
    }

    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'rubro_id', 'rubro_id');
    }

    public function compraRubroProveedores(): HasMany
    {
        return $this->hasMany(CompraRubroProveedor::class, 'rubro_id', 'rubro_id')
            ->where('nro_obra', $this->nro_obra)
            ->where('pedido_compra_id', $this->pedido_compra_id);
    }

    public function compraRubroGrupos(): HasMany
    {
        return $this->hasMany(CompraRubroGrupo::class, 'rubro_id', 'rubro_id')
            ->where('nro_obra', $this->nro_obra)
            ->where('pedido_compra_id', $this->pedido_compra_id);
    }

    public function proveedores(): BelongsToMany
    {
        return $this->belongsToMany(
            Proveedor::class,
            'Compra_Rubro_Proveedor',
            'rubro_id',
            'proveedor_id',
            'rubro_id',
            'proveedor_id'
        )->withPivot(['nro_obra', 'pedido_compra_id'])
            ->wherePivot('nro_obra', $this->nro_obra)
            ->wherePivot('pedido_compra_id', $this->pedido_compra_id);
    }

    public function grupos(): BelongsToMany
    {
        return $this->belongsToMany(
            Grupo::class,
            'Compra_Rubro_Grupo',
            'rubro_id',
            'grupo_id',
            'rubro_id',
            'grupo_id'
        )->withPivot(['nro_obra', 'pedido_compra_id'])
            ->wherePivot('nro_obra', $this->nro_obra)
            ->wherePivot('pedido_compra_id', $this->pedido_compra_id);
    }
}
