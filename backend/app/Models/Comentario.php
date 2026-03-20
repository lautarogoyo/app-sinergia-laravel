<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CORRECCIÓN: Comentario necesita timestamps para mostrar fecha de creación
 * en el modal (created_at). La migración ahora incluye $table->timestamps().
 */
class Comentario extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Comentario';

    protected $primaryKey = ['obra_id', 'comentario_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    // CORRECCIÓN: activamos timestamps en este modelo específico
    public $timestamps = true;

    /**
     * CORRECCIÓN: genera comentario_id automáticamente al crear.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->comentario_id)) {
                $model->comentario_id = $model->resolveNextSequentialId('comentario_id', 'obra_id');
            }
        });
    }

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }
}