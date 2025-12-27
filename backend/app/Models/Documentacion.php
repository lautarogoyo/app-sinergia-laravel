<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Documentacion extends Model
{
    use HasFactory;

    protected $table = 'documentaciones';

    protected $fillable = [
        'path',
        'fecha_vencimiento',
        'estado',
        'mime',              // opcional si lo agregás en la migración
        'size',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
    ];

    protected $appends = ['url'];

    // Accessor para obtener la URL pública (requiere `php artisan storage:link`)
    public function getUrlAttribute()
    {
        if (!$this->path) {
            return null;
        }
        // Si usás otro disk (ej. s3), cambiá 'public' por el que corresponda
        return Storage::disk('public')->url($this->path);
    }

    // Relaciones
    public function tipoDocumento():BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    public function empleado() : BelongsTo
    {
        return $this->belongsTo(Empleado::class);
    }
}
