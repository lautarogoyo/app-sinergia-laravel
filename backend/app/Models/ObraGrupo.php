<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObraGrupo extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Obra_Grupo';
    protected $primaryKey = ['grupo_id', 'obra_id'];
    public $incrementing = false;
    protected $keyType = 'array';

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id', 'grupo_id');
    }
}
