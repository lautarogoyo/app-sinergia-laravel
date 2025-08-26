<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Empleado extends Model
{
    use HasFactory;
    protected $table = 'empleados';

    protected $fillable = [
        'nombre',
        'apellido',
        'grupo',
        'telefono',
        'estado'
    ];
    
    public function documentaciones()
{
    return $this->hasMany(Documentacion::class);
}

}
