<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    /** @use HasFactory<\Database\Factories\ProveedorFactory> */
    use HasFactory;
    protected $table = 'proveedores';
    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'email',
        'monotributista',
        'direccion',
        'comentario',
        'fecha_ingreso',

    ];
    
    protected $casts = [
        'fecha_ingreso' => 'date',
    ];
    public function usuario() : BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function proveedor_rubro_grupo() : HasMany
    {
        return $this->hasMany(Proveedor_Rubro_Grupo::class);
    }
}
