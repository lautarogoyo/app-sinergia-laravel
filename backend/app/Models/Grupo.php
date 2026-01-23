<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Empleado;
use App\Models\Obra;
use App\Models\Rubro;

class Grupo extends Model
{
    /** @use HasFactory<\Database\Factories\GrupoFactory> */
    use HasFactory;
    protected $table = 'grupos';
     protected $fillable = [
        'denominacion'
    ];
    public function empleados() : HasMany
    {
        return $this->hasMany(Empleado::class);
    }

    public function obras() : BelongsToMany
    {
        return $this->belongsToMany(Obra::class,'obra_grupo',
            'grupo_id',
            'obra_id')->withTimestamps();
    }

    public function rubros() : BelongsToMany
    {
        return $this->belongsToMany(
            Rubro::class,
            'rubro_grupo',
            'grupo_id',
            'rubro_id'
        )->withTimestamps();
    }
}
