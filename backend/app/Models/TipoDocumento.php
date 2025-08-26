<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoDocumento extends Model
{
    use HasFactory;
    protected $table = 'tipo_documentos';

    protected $fillable = [
        'descripcion'
    ];
}
