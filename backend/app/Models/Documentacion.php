<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Documentacion extends Model
{
    use HasFactory;
    protected $table = 'documentaciones';

    protected $fillable = [
        'id_tipo_documento',
        'id_empleado',
        'path_archivo_documento',
        'fecha_vencimiento'
    ];

    // Relaciones
    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipo_documento');
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }
}
