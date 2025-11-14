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

}
