<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rubro extends SinergiaModel
{
    protected $table = 'Rubro';

    protected $primaryKey = 'rubro_id';

    public function proveedorRubros(): HasMany
    {
        return $this->hasMany(ProveedorRubro::class, 'rubro_id', 'rubro_id');
    }

    public function proveedores(): BelongsToMany
    {
        return $this->belongsToMany(
            Proveedor::class,
            'Proveedor_Rubro',
            'rubro_id',
            'proveedor_id',
            'rubro_id',
            'proveedor_id'
        );
    }

    public function compraRubros(): HasMany
    {
        return $this->hasMany(CompraRubro::class, 'rubro_id', 'rubro_id');
    }
}
