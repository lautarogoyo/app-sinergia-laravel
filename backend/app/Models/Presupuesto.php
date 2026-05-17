<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
    public $timestamps = false;

    protected $table = 'Presupuesto';
    protected $primaryKey = 'presupuesto_id';

    protected $fillable = [
        'pedido_compra_id',
        'nro_obra',
        'path_archivo',
        'nombre_archivo',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function pedidoCompra()
    {
        return $this->belongsTo(PedidoCompra::class, 'pedido_compra_id', 'pedido_compra_id');
    }
}