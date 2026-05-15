<?php

namespace App\Models;

class CompraGrupo extends SinergiaModel
{

    protected $table = 'Compra_Grupo';
    protected $primaryKey = ['nro_obra', 'pedido_compra_id', 'grupo_id'];
    public $incrementing = false;
}