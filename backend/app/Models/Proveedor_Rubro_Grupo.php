<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proveedor_Rubro_Grupo extends Model
{
    /** @use HasFactory<\Database\Factories\ProveedorRubroGrupoFactory> */
    use HasFactory;
    protected $table = 'proveedor_rubro_grupo';
    protected $fillable = [
        'descripcion',
        'id_rubro',
        'id_proveedor',
        'id_grupo'
    ];

    public function rubro() : BelongsTo
    {
        return $this->belongsTo(Rubro::class);
    }

    public function proveedor() : BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function grupo() : BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }

}
