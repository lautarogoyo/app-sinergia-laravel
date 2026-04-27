<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proveedor extends SinergiaModel
{
    protected $table = 'Proveedor';

    protected $primaryKey = 'proveedor_id';

    protected $fillable = [
        'nombre_apellido',
        'tipo_facturacion_id',
        'telefono',
        'email',
        'direccion',
        'ciudad',
        'calificacion',
        'contacto',
        'observacion',
        'fecha_ingreso',
        'usuario_id',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
    ];

    public function tipoFacturacion(): BelongsTo
    {
        return $this->belongsTo(TipoFacturacion::class, 'tipo_facturacion_id', 'tipo_facturacion_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'usuario_id');
    }
}