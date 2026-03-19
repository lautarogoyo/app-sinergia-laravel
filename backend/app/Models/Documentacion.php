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

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id', 'empleado_id');
    }

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipoDocumento', 'tipoDocumento_id');
    }

    public function estadoDocumentacion(): BelongsTo
    {
        return $this->belongsTo(EstadoDocumentacion::class, 'id_estado_documentacion', 'estado_documentacion_id');
    }
}
