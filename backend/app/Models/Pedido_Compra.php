<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido_Compra extends Model
{
    /** @use HasFactory<\Database\Factories\PedidoCompraFactory> */
    use HasFactory;
    protected $table = 'pedido_compra';
    protected $fillable = [
        'rol',
        'path_presupuesto',
        'fecha_pedido',
        'fecha_entrega_estimada',
        'estado_contratista',
        'estado_pedido',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_pedido' => 'date',
        'fecha_entrega_estimada' => 'date',
    ];

    public function compraRubros() : hasMany
    {
        return $this->hasMany(Compra_Rubro::class);
    }

    public function obraAdjudicada() : hasMany
    {
        return $this->hasMany(Obra_Adjudicada::class);
    }

}
