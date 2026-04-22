<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documentacion extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Documentacion';
    protected $primaryKey = ['empleado_id', 'documentacion_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    protected $casts = [
        'fecha_vencimiento' => 'date',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->documentacion_id)) {
                $model->documentacion_id = $model->resolveNextSequentialId(
                    'documentacion_id',
                    'empleado_id'
                );
            }
        });
    }

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id', 'empleado_id');
    }

    public function tipoDocumentacion(): BelongsTo
    {
        return $this->belongsTo(TipoDocumentacion::class, 'tipo_documentacion_id', 'tipo_documentacion_id');
    }

    public function estadoDocumentacion(): BelongsTo
    {
        return $this->belongsTo(EstadoDocumentacion::class, 'estado_documentacion_id', 'estado_documentacion_id');
    }
}
