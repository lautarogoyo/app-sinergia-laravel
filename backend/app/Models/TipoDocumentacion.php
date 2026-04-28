<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoDocumentacion extends EstadoCatalogo
{
    protected $table = 'Tipo_Documentacion';
    protected $primaryKey = 'tipo_documentacion_id';

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'tipo_documentacion_id', 'tipo_documentacion_id');
    }
}
