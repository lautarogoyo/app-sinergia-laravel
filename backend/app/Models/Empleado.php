<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'id_grupo',
    ];
    
    public function documentaciones()
    {
        return $this->hasMany(Documentacion::class, 'id_empleado');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo');
    }
}
