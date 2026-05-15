<?php

namespace App\Models;

class CompraProveedor extends SinergiaModel
{

    protected $table = 'Compra_Proveedor';
    protected $primaryKey = ['nro_obra', 'pedido_compra_id', 'proveedor_id'];
    public $incrementing = false;
}