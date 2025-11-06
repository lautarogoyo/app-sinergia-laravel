<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    /** @use HasFactory<\Database\Factories\GrupoFactory> */
    use HasFactory;
    protected $table = 'grupos';
     protected $fillable = [
        'denominacion'
    ];
    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'id_grupo');
    }
}
