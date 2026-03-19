<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comentario extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Comentario';

    protected $primaryKey = ['obra_id', 'comentario_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }
}
