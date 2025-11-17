<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Obra;

class Orden_Compra extends Model
{
    /** @use HasFactory<\Database\Factories\OrdenCompraFactory> */
    use HasFactory;
    protected $table = 'ordenes_compra';
    protected $fillable = [
        'detalle',
        'fecha_inicio_orden_compra',
        'fecha_fin_orden_compra',
    ];

    protected $casts = [
        'fecha_inicio_orden_compra' => 'date',
        'fecha_fin_orden_compra' => 'date',
    ];

    /**
     * An orden de compra belongs to an obra
     */
    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'id_obra');
    }
}
