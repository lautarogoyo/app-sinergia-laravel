<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\PedidoCompra;
use App\Models\Proveedor;
use App\Models\Grupo;

class Rubro extends Model
{
    /** @use HasFactory<\Database\Factories\RubroFactory> */
    use HasFactory;
    protected $table = 'rubros';
    protected $fillable = [
        'descripcion'
    ];

    public function pedidosCompra() : BelongsToMany
    {
        return $this->belongsToMany(PedidoCompra::class, 'compra_rubro',
            'rubro_id',
            'pedido_id')->withTimestamps();
    }

    public function proveedores() : BelongsToMany
    {
        return $this->belongsToMany(
            Proveedor::class,
            'rubro_proveedor',
            'rubro_id',
            'proveedor_id'
        )->withTimestamps();
    }

    public function grupos() : BelongsToMany
    {
        return $this->belongsToMany(
            Grupo::class,
            'rubro_grupo',
            'rubro_id',
            'grupo_id'
        )->withTimestamps();
    }
}
