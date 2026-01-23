<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Usuario;
use App\Models\Rubro;

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
        'monotributista' => 'boolean',
        ];
    public function usuario() : BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function rubros() : BelongsToMany
    {
        return $this->belongsToMany(
            Rubro::class,
            'rubro_proveedor',
            'proveedor_id',
            'rubro_id'
        )->withTimestamps();
    }

}
