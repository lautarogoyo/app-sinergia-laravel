<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoFacturacion extends EstadoCatalogo
{
    protected $table = 'Tipo_Facturacion';
    protected $primaryKey = 'tipo_facturacion_id';

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class, 'tipo_facturacion_id', 'tipo_facturacion_id');
    }

    public function proveedores(): HasMany
    {
        return $this->hasMany(Proveedor::class, 'tipo_facturacion_id', 'tipo_facturacion_id');
    }
}
