<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class EstadoCatalogo extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'descripcion',
    ];
}
