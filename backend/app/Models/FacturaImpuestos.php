<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacturaImpuestos extends Model
{
    protected $table      = 'Factura_Impuestos';
    protected $primaryKey = 'nro_factura';
    public $incrementing  = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $fillable = [
        'nro_factura',
        'neto_gral', 'neto_dif', 'neto_spub',
        'iva_gral_alicuota', 'iva_gral_importe',
        'iva_dif_alicuota',  'iva_dif_importe',
        'iva_spub_alicuota', 'iva_spub_importe',
        'no_gravado_monotrib', 'no_gravado_exento',
        'perc_iva', 'perc_iibb', 'perc_otras',
        'ret_iva',  'ret_iibb',  'ret_gcias', 'ret_otras',
        'imp_internos', 'itc', 'varios',
    ];

    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'nro_factura', 'nro_factura');
    }
}