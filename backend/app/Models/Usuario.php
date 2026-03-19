<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;

class Usuario extends SinergiaModel
{
    protected $table = 'Usuario';

    protected $primaryKey = 'usuario_id';

    protected $hidden = [
        'contrasenia',
    ];

    public function setContraseniaAttribute($value): void
    {
        if ($value !== null && $value !== '') {
            $this->attributes['contrasenia'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
        }
    }

    public function proveedores(): HasMany
    {
        return $this->hasMany(Proveedor::class, 'usuario_id', 'usuario_id');
    }
}
