<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Documentacion extends Model
{
    use HasFactory;

    protected $table = 'documentaciones';

    protected $fillable = [
        'id_tipo_documento',
        'id_empleado',
        'path_archivo_documento',
        'mime',              // opcional si lo agregás en la migración
        'size',              // opcional si lo agregás en la migración
        'fecha_vencimiento',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
    ];

    protected $appends = ['url'];

    // Accessor para obtener la URL pública (requiere `php artisan storage:link`)
    public function getUrlAttribute()
    {
        if (!$this->path_archivo_documento) {
            return null;
        }
        // Si usás otro disk (ej. s3), cambiá 'public' por el que corresponda
        return Storage::disk('public')->url($this->path_archivo_documento);
    }

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
