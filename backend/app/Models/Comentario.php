<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comentario extends SinergiaModel
{
    use SoftDeletes;

    protected $table = 'Comentario';
    protected $primaryKey = 'comentario_id';
    public $timestamps = true;
    protected $fillable = [
        'obra_id',
        'detalle',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }
}
