<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Empleado extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'empleados';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'cbu',
        'alias',
        'estado',
    ];
    
    public function documentaciones() : HasMany
    {
        return $this->hasMany(Documentacion::class);
    }

    public function grupo() : BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }
}
