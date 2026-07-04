<?php

namespace App\Models;

class CompraProveedor extends SinergiaModel
{

    protected $table = 'Compra_Proveedor';
    protected $primaryKey = ['obra_id', 'pedido_compra_id', 'proveedor_id'];
    public $incrementing = false;
}