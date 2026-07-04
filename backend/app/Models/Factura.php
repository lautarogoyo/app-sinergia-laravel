<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Factura extends SinergiaModel
{
    protected $table = 'Factura';
    protected $primaryKey = 'nro_factura';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nro_factura',
        'nro_oc',
        'obra_id',
        'proveedor_id',
        'grupo_id',
        'fecha',
        'tipo_factura',
        'empresa',
        'forma_pago',
        'cantidad_dias',
        'email',
        'importe_total',
    ];

    protected $casts = [
        'fecha'         => 'date',
        'importe_total' => 'decimal:2',
    ];

    public function obra(): BelongsTo
    {
        return $this->belongsTo(Obra::class, 'obra_id', 'obra_id');
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id', 'proveedor_id');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id', 'grupo_id');
    }

    // La FK compuesta a Orden_Compra (nro_oc + obra_id) no tiene soporte nativo
    // en Eloquent BelongsTo; se accede via ordenCompra() con query manual si se necesita.
    public function ordenCompra(): ?OrdenCompra
    {
        if ($this->nro_oc === null) {
            return null;
        }

        return OrdenCompra::where('nro_oc', $this->nro_oc)
            ->where('obra_id', $this->obra_id)
            ->first();
    }
    public function impuestos(): HasOne
{
    return $this->hasOne(FacturaImpuestos::class, 'nro_factura', 'nro_factura');
}
}
