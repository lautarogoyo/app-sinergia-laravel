<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoDocumentacion extends EstadoCatalogo
{
    protected $table = 'Estado_Documentacion';

    protected $primaryKey = 'estado_documentacion_id';

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'id_estado_documentacion', 'estado_documentacion_id');
    }
}
