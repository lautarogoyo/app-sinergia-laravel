<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class SinergiaModel extends Model
{
    public $timestamps = false;

    protected $guarded = [];
}
