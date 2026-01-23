<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Documentacion;

class TipoDocumento extends Model
{
    use HasFactory;
    protected $table = 'tipo_documentos';

    protected $fillable = [
        'descripcion'
    ];

    public function documentaciones() : HasMany
    {
        return $this->hasMany(Documentacion::class);
    }
}
