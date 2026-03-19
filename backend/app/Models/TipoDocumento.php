<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoDocumento extends SinergiaModel
{
    protected $table = 'TipoDocumento';

    protected $primaryKey = 'tipoDocumento_id';

    public function documentaciones(): HasMany
    {
        return $this->hasMany(Documentacion::class, 'id_tipoDocumento', 'tipoDocumento_id');
    }
}
