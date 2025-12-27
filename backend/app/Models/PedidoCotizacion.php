<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Grupo;
use App\Models\Obra;

class PedidoCotizacion extends Model
{
    use HasFactory;

    // The migration creates the table `pedido_cotizacion` (singular), keep model aligned.
    protected $table = 'pedidos_cotizacion';

    protected $fillable = [
        'path',
        'fecha_cierre_cotizacion',
        'estado_cotizacion',
        'estado_comparativa',
    ];

    protected $casts = [
        'fecha_cierre_cotizacion' => 'date',
    ];

    public function grupos() : BelongsToMany
    {

        return $this->belongsToMany(
            Grupo::class,
            'grupos_pedido_cotizacion',
            'pedido_id', 
            'grupo_id'  
        )->withTimestamps();
    }

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class);
    }

    public function obra_adjudicada(): HasOne
    {
        return $this->hasOne(Obra_Adjudicada::class);
    }
}
