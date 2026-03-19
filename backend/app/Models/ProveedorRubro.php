<?php

namespace App\Models;

use App\Models\Concerns\HasCompositePrimaryKey;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProveedorRubro extends SinergiaModel
{
    use HasCompositePrimaryKey;

    protected $table = 'Proveedor_Rubro';

    protected $primaryKey = ['proveedor_id', 'rubro_id'];

    public $incrementing = false;

    protected $keyType = 'array';

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id', 'proveedor_id');
    }

    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'rubro_id', 'rubro_id');
    }
}
