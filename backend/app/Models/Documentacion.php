<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\TipoDocumento;
use App\Models\Empleado;


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
        'empleado_id',
        'tipo_documento_id'
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
        // Usar la ruta de descarga en lugar del URL directo
        return '/api/empleados/' . $this->empleado_id . '/documentaciones/' . $this->id . '/download';
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
