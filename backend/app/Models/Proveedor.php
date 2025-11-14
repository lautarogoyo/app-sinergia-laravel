<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'id_usuario',    

    ];
    
    protected $casts = [
        'fecha_ingreso' => 'date',
    ];
    public function usuario() : BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function rubros() : BelongsToMany
    {
        return $this->belongsToMany(Rubro::class);
    }
}
