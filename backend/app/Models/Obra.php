<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obra extends Model
{
    /** @use HasFactory<\Database\Factories\ObraFactory> */
    use HasFactory;
    protected $table = 'obras';
    protected $fillable = [
    'nro_obra',
    'detalle',
    'estado',
    'fecha_visto',
    'direccion',
    'fecha_ingreso',
    'fecha_programacion_inicio',
    'fecha_recepcion_provisoria',
    'fecha_recepcion_definitiva',
    'detalle_caratula'];

    protected $casts = [
        'fecha_visto' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_programacion_inicio' => 'date',
        'fecha_recepcion_provisoria' => 'date',
        'fecha_recepcion_definitiva' => 'date',
    ];

    
}


