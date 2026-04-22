<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'Usuario';

    protected $primaryKey = 'usuario_id';

    public $timestamps = false;

    protected $guarded = [];

    protected $hidden = [
        'contrasenia',
    ];

    public function setContraseniaAttribute($value): void
    {
        if ($value !== null && $value !== '') {
            $this->attributes['contrasenia'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
        }
    }

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class, 'usuario_id', 'usuario_id');
    }

    public function proveedores(): HasMany
    {
        return $this->hasMany(Proveedor::class, 'usuario_id', 'usuario_id');
    }
}
