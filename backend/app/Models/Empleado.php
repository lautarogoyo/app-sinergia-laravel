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
        'grupo',
        'telefono',
        'cbu',
        'alias',
        'estado'
    ];
    
    public function documentaciones()
    {
        return $this->hasMany(Documentacion::class, 'id_empleado');
    }

}
