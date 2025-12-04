<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obra_Adjudicada extends Model
{
    /** @use HasFactory<\Database\Factories\ObraAdjudicadaFactory> */
    use HasFactory;
    protected $table = 'obras_adjudicadas';
    protected $fillable = [
        'id_pedido_cotizacion',
        'id_pedido_compra'
    ];

    public function pedido_cotizacion () : belongsTo
    {
        return $this->belongsTo(PedidoCotizacion::class);
    }

    public function pedido_compra () : belongsTo
    {
        return $this->belongsTo(PedidoCompra::class);
    }


}
