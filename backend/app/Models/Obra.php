<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Obra extends Model
{
    /** @use HasFactory<\Database\Factories\ObraFactory> */
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'obras';
    protected $fillable = [
        'nro_obra',
        'detalle',
        'estado_obra_id',
        'fecha_visto',
        'fecha_ingreso',
        'fecha_programacion_inicio',
        'fecha_recepcion_provisoria',
        'fecha_recepcion_definitiva',
        'detalle_caratula',
    ];

    protected $appends = ['estado'];

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

    public function estadoObra(): BelongsTo
    {
        return $this->belongsTo(EstadoObra::class, 'estado_obra_id');
    }

    public function getEstadoAttribute(): ?string
    {
        return $this->estadoObra?->descripcion;
    }

    public function setEstadoAttribute(?string $value): void
    {
        $this->attributes['estado_obra_id'] = $this->resolveEstadoCatalogId($value, EstadoObra::class);
    }
}

