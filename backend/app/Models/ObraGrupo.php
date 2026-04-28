<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObraGrupo extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Obra_Grupo';
    protected $primaryKey = ['id_grupo', 'nro_obra'];
    public $incrementing = false;
    protected $keyType = 'array';

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'nro_obra', 'nro_obra');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'grupo_id');
    }
}
