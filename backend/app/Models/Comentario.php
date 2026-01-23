<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Obra;

class Comentario extends Model
{
    /** @use HasFactory<\Database\Factories\ComentarioFactory> */
    use HasFactory;
    protected $table = 'comentarios';
    protected $fillable = [
        'denominacion',
    ];

    public function obra () : BelongsTo
    {
        return $this->belongsTo(Obra::class);
    }
}
