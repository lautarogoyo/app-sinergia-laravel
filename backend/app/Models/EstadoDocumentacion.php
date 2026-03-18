<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoDocumentacion extends EstadoCatalogo
{
    protected $table = 'estado_documentaciones';

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'estado_documentacion_id');
    }
}
