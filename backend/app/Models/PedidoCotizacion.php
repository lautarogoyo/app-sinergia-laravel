<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCotizacion extends Model
{
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'pedidos_cotizacion';

    protected $fillable = [
        'path_archivo_cotizacion',
        'path_archivo_mano_obra',
        'fecha_cierre_cotizacion',
        'estado_cotizacion_id',
        'estado_comparativa_id',
        'obra_id'
    ];

    protected $appends = ['estado_cotizacion', 'estado_comparativa'];

    protected $casts = [
        'fecha_cierre_cotizacion' => 'date',
    ];


    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class);
    }

    public function estadoCotizacion(): BelongsTo
    {
        return $this->belongsTo(EstadoCotizacion::class, 'estado_cotizacion_id');
    }

    public function estadoComparativa(): BelongsTo
    {
        return $this->belongsTo(EstadoComparativa::class, 'estado_comparativa_id');
    }

    public function getEstadoCotizacionAttribute(): ?string
    {
        return $this->estadoCotizacion?->descripcion;
    }

    public function setEstadoCotizacionAttribute(?string $value): void
    {
        $this->attributes['estado_cotizacion_id'] = $this->resolveEstadoCatalogId($value, EstadoCotizacion::class);
    }

    public function getEstadoComparativaAttribute(): ?string
    {
        return $this->estadoComparativa?->descripcion;
    }

    public function setEstadoComparativaAttribute(?string $value): void
    {
        $this->attributes['estado_comparativa_id'] = $this->resolveEstadoCatalogId($value, EstadoComparativa::class);
    }
}
