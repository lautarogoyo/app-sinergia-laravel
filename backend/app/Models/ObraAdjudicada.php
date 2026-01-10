<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Obra_Adjudicada extends Model
{
    /** @use HasFactory<\Database\Factories\ObraAdjudicadaFactory> */
    use HasFactory;
    protected $table = 'obras_adjudicadas';
    
    public function pedido_cotizacion () : belongsTo
    {
        return $this->belongsTo(PedidoCotizacion::class);
    }

    public function pedido_compra () : belongsTo
    {
        return $this->belongsTo(PedidoCompra::class);
    }


}
