<?php

namespace App\Models;

class CompraGrupo extends SinergiaModel
{

    protected $table = 'Compra_Grupo';
    protected $primaryKey = ['obra_id', 'pedido_compra_id', 'grupo_id'];
    public $incrementing = false;
}