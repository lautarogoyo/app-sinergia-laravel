<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Comentario;
use App\Models\PedidoCotizacion;
use App\Models\Grupo;
use App\Models\OrdenCompra;
use App\Models\PedidoCompra;


class Obra extends Model
{
    /** @use HasFactory<\Database\Factories\ObraFactory> */
    use HasFactory;
    protected $table = 'obras';
    protected $fillable = [
    'nro_obra',
    'detalle',
    'estado',
    'fecha_visto',
    'fecha_ingreso',
    'fecha_programacion_inicio',
    'fecha_recepcion_provisoria',
    'fecha_recepcion_definitiva',
    'detalle_caratula'];

    protected $casts = [
        'fecha_visto' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_programacion_inicio' => 'date',
        'fecha_recepcion_provisoria' => 'date',
        'fecha_recepcion_definitiva' => 'date',
    ];


    public function ordenCompra() : HasOne
    {
        return $this->hasOne(OrdenCompra::class);
    }

    public function comentarios () : HasMany
    {
        return $this->hasMany(Comentario::class);
    }
    
    public function pedidosCotizacion () : HasMany
    {
        return $this->hasMany(PedidoCotizacion::class);
    }

    public function grupos() : BelongsToMany
    {
        return $this->belongsToMany(Grupo::class,'obra_grupo',
            'obra_id',
            'grupo_id')->withTimestamps();
    }

    public function pedidoCompra() : HasMany
    {
        return $this->hasMany(PedidoCompra::class);
    }
}


