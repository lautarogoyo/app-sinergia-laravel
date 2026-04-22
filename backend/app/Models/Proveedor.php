<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends SinergiaModel
{
    protected $table = 'Proveedor';
    protected $primaryKey = 'proveedor_id';

    protected $casts = [
        'fecha_ingreso' => 'date',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'usuario_id');
    }

    public function tipoFacturacion(): BelongsTo
    {
        return $this->belongsTo(TipoFacturacion::class, 'tipo_facturacion_id', 'tipo_facturacion_id');
    }

    public function proveedorRubros(): HasMany
    {
        return $this->hasMany(ProveedorRubro::class, 'proveedor_id', 'proveedor_id');
    }

    public function rubros(): BelongsToMany
    {
        return $this->belongsToMany(
            Rubro::class,
            'Proveedor_Rubro',
            'proveedor_id',
            'rubro_id',
            'proveedor_id',
            'rubro_id'
        );
    }

    public function compraRubroProveedores(): HasMany
    {
        return $this->hasMany(CompraRubroProveedor::class, 'proveedor_id', 'proveedor_id');
    }
}
