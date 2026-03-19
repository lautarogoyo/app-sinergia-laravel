<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObraGrupo extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Obra_grupo';

    protected $primaryKey = ['id_obra', 'id_grupo'];

    public $incrementing = false;

    protected $keyType = 'array';

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'id_obra', 'obra_id');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'grupo_id');
    }
}
