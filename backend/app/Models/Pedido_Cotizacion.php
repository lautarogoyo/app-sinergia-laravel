<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Grupo;
use App\Models\Obra;

class Pedido_Cotizacion extends Model
{
    use HasFactory;

    // The migration creates the table `pedido_cotizacion` (singular), keep model aligned.
    protected $table = 'pedido_cotizacion';

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

        return $this->belongsToMany(Grupo::class, 'grupo_pedido_cotizacion')->withTimestamps();
    }

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class);
    }
}
