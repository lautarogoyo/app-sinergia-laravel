<?php

namespace App\Models;

use App\Models\Concerns\ResolvesEstadoCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documentacion extends Model
{
    use HasFactory;
    use ResolvesEstadoCatalog;

    protected $table = 'documentaciones';

    protected $fillable = [
        'path',
        'fecha_vencimiento',
        'estado_documentacion_id',
        'mime',
        'size',
        'empleado_id',
        'tipo_documento_id',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
    ];

    protected $appends = ['url', 'estado'];

    public function getUrlAttribute(): ?string
    {
        if (! $this->path) {
            return null;
        }

        return '/api/empleados/' . $this->empleado_id . '/documentaciones/' . $this->id . '/download';
    }

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class);
    }

    public function estadoDocumentacion(): BelongsTo
    {
        return $this->belongsTo(EstadoDocumentacion::class, 'estado_documentacion_id');
    }

    public function getEstadoAttribute(): ?string
    {
        return $this->estadoDocumentacion?->descripcion;
    }

    public function setEstadoAttribute(?string $value): void
    {
        $this->attributes['estado_documentacion_id'] = $this->resolveEstadoCatalogId($value, EstadoDocumentacion::class);
    }
}
