<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Usuario extends Model
{
    /** @use HasFactory<\Database\Factories\UsuarioFactory> */
    use HasFactory;

    // Añadir campos asignables
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'contrasenia',
    ];

    // Ocultar la contraseña al serializar
    protected $hidden = [
        'contrasenia',
    ];

    // Mutator para hashear la contrasenia siempre que se asigne
    public function setContraseniaAttribute($value)
    {
        if ($value !== null && $value !== '') {
            $this->attributes['contrasenia'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
        }
    }

    public function proveedores() : HasMany
    {
        return $this->hasMany(Proveedor::class);
    }
}
