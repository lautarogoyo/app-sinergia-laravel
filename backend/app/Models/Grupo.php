<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Grupo extends Model
{
    /** @use HasFactory<\Database\Factories\GrupoFactory> */
    use HasFactory;
    protected $table = 'grupos';
     protected $fillable = [
        'denominacion'
    ];
    public function empleados() : HasMany
    {
        return $this->hasMany(Empleado::class);
    }

    public function pedido_cotizacion() : BelongsToMany
    {
        return $this->belongsToMany(PedidoCotizacion::class,'pedido_grupo',
            'grupo_id',
            'pedido_id')->withTimestamps();
    }

    public function proveedor_rubro_grupo() : hasMany
    {
        return $this->hasMany(ProveedorRubroGrupo::class);
    }
}
