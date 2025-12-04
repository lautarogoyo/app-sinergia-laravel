<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rubro extends Model
{
    /** @use HasFactory<\Database\Factories\RubroFactory> */
    use HasFactory;
    protected $table = 'rubros';
    protected $fillable = [
        'descripcion'
    ];

    public function proveedores() : BelongsToMany
    {
        return $this->belongsToMany(Proveedor::class);
    }

    public function compraRubros() : HasMany
    {
        return $this->hasMany(Compra_Rubro::class);
    }

    public function proveedor_rubro_grupo() : HasMany
    {
        return $this->hasMany(Proveedor_Rubro_Grupo::class);
    }
}
