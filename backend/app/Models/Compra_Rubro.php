<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Compra_Rubro extends Model
{
    /** @use HasFactory<\Database\Factories\CompraRubroFactory> */
    use HasFactory;
    protected $table = 'compra_rubro';
    protected $fillable = [
        'path_material',
        'id_rubro',
        'id_pedido_compra'
    ];

    public function rubro () : BelongsTo
    {
        return $this->belongsTo(Rubro::class);
    }

    public function pedido_compra () : BelongsTo
    {
        return $this->belongsTo(PedidoCompra::class);
    }
}
